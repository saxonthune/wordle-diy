Write-Host "[deploy.ps1] Cleaning and building output directory"
cd ./wordle-diy
Remove-Item -Recurse -Force ./out/*
npm run build
cd ..
# build
Write-Host "[deploy.ps1] uploading to S3"
aws s3 sync --delete ./wordle-diy/out/ s3://your-site/wordle
Write-Host "[deploy.ps1] Done. https://spacetime.saxon.zone"
