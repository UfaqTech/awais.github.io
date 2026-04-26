$base = "https://ufaqtech.github.io/awais.github.io/"
Get-ChildItem -Path . -Recurse -Include *.html | ForEach-Object {
    $relPath = $_.FullName.Replace((Get-Location).Path + '\', '').Replace('\','/')
    if ($relPath -eq 'index.html') {
        $url = $base
    } elseif ($relPath.EndsWith('/index.html')) {
        $url = $base + $relPath.Replace('/index.html','/')
    } else {
        $url = $base + $relPath
    }
    $content = Get-Content $_.FullName -Raw
    if ($content -notmatch 'rel="canonical"') {
        $content = $content -replace '(</title>)', "</title>`n    <link rel=`"canonical`" href=`"$url`" />"
    }
    if ($content -notmatch 'rel="manifest"') {
        $content = $content -replace '(rel="canonical")', "rel=`"canonical`">`n    <link rel=`"manifest`" href=`"/manifest.json`" />"
    }
    if ($content -notmatch 'name="theme-color"') {
        $content = $content -replace '(rel="manifest")', "rel=`"manifest`">`n    <meta name=`"theme-color`" content=`"#00d4ff`" />"
    }
    Set-Content $_.FullName $content
}