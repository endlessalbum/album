@echo off
echo ==============================
echo Push to GitHub and Deploy to Render
echo ==============================

:: Проверяем, есть ли origin, если нет - добавляем
git remote -v | find "origin" >nul
if %errorlevel% neq 0 (
    echo Adding origin remote...
    git remote add origin https://github.com/endlessalbum/album.git
)

:: Добавляем изменения
echo Adding changes...
git add .

:: Делаем коммит (если есть что коммитить)
git diff-index --quiet HEAD
if %errorlevel% neq 0 (
    echo Committing...
    git commit -m "Auto push"
) else (
    echo No changes to commit.
)

:: Форсированный пуш (обязательно после filter-repo)
echo Pushing to GitHub...
git push origin main --force

echo ==============================
echo Done! GitHub updated and Render deploy triggered.
echo ==============================
pause