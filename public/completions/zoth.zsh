#compdef zoth

_zoth() {
    local -a commands
    commands=(
        'start:Start all Zoth Studio servers (:8484, :8088, :8787)'
        'stop:Stop all running Zoth servers'
        'status:Show real-time status of all ports and tool pipelines'
        'tui:Launch interactive Terminal User Interface (TUI) cockpit'
        'list:List all registered sovereign tools'
        'doctor:Run system diagnostics and environment audits'
        'update:Pull latest git commits and update local binaries'
    )

    _arguments -C \
        '1: :->command' \
        '*:: :->args'

    case $state in
        command)
            _describe -t commands 'zoth command' commands
            ;;
        args)
            case $line[1] in
                list)
                    _arguments \
                        '--summary[Group tools by category]' \
                        '(-c --category)'{-c,--category}'[Filter by category]:category:'
                    ;;
            esac
            ;;
    esac
}

_zoth "$@"
