# bash completion for zoth CLI
_zoth_completions() {
    local cur prev opts commands
    COMPREPLY=()
    cur="${COMP_WORDS[COMP_CWORD]}"
    prev="${COMP_WORDS[COMP_CWORD-1]}"
    commands="start stop status tui list doctor run update scan deps help"

    if [ "$COMP_CWORD" -eq 1 ]; then
        COMPREPLY=( $(compgen -W "${commands}" -- "${cur}") )
        return 0
    fi

    case "${prev}" in
        list)
            COMPREPLY=( $(compgen -W "--summary --category -c" -- "${cur}") )
            return 0
            ;;
        doctor|tui|start|stop|status|update)
            return 0
            ;;
        *)
            ;;
    esac
}
complete -F _zoth_completions zoth
