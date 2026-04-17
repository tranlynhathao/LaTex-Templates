mkdir -p .home .cache && \
HOME=$PWD/.home XDG_CACHE_HOME=$PWD/.cache \
TEXINPUTS=./ldvtheme//:./bibtex//:$TEXINPUTS \
latexmk -norc -pvc -lualatex -interaction=nonstopmode -synctex=1 -view=none example.tex
