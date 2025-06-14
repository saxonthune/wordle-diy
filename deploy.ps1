param (
    [switch]$Clean
)

Write-Host "[deploy.ps1] Cleaning and building output directory"
$productionUrls = Get-Content ./deployment.production.json | ConvertFrom-Json
cd ./wordle-diy
Rename-Item -Path .\.env.local -NewName .\.envfoo.local -ErrorAction Stop
Remove-Item -Recurse -Force ./out/*
npm run build
if ($LASTEXITCODE -ne 0) {
    Rename-Item -Path .\.envfoo.local -NewName .\.env.local -ErrorAction SilentlyContinue 
    cd ..
    Write-Host "[deploy.ps1] Build failed. Exiting." -ForegroundColor Red
    exit $LASTEXITCODE
}
Rename-Item -Path .\.envfoo.local -NewName .\.env.local -ErrorAction SilentlyContinue 
cd ..
# build
Write-Host "[deploy.ps1] uploading to S3"
if ($Clean) {
    aws s3 rm $($productionUrls.s3BucketArn + "/wordle/") --recursive
}
aws s3 sync --delete ./wordle-diy/out/ $($productionUrls.s3BucketArn) 
Write-Host "[deploy.ps1] Done. $($productionUrls.siteUrl)"
