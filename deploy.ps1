param (
    [switch]$Clean
)

Write-Host "[deploy.ps1] Cleaning and building output directory"
$productionUrls = Get-Content ./deploy.production.json | ConvertFrom-Json
cd ./wordle-diy
Remove-Item -Recurse -Force ./out/*
npm run build
cd ..
# build
Write-Host "[deploy.ps1] uploading to S3"
if ($Clean) {
    aws s3 rm $($productionUrls.s3BucketArn) --recursive
}
aws s3 sync --delete ./wordle-diy/out/ $($productionUrls.s3BucketArn) 
Write-Host "[deploy.ps1] Done. $($productionUrls.s3BucketArn)"
