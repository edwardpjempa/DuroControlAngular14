
export var popup_prompts:any = {
    leave_saved_changes: {
        header: "Discard Changes",
        prompt: "Changes will not be saved. Do you want to proceed?",
        noBtn: "Cancel",
        yesBtn: {
            name: "OK",
            action: 'discard'
        }
    },
    leave_debugging: {
        header: "Stop Debugging",
        prompt: "There is a running debug session. Do you want to stop debugging?",
        noBtn: "Cancel",
        yesBtn: {
            name: "Stop Debug",
            action: 'stop_debug'
        }
    },
    upload_new: {
        header: "Save and Upload",
        prompt: `Save and upload current configuration to Duro? This action will automatically
                start the module if enabled.`,
        noBtn: "Cancel",
        yesBtn: {
            name: "Upload",
            action: 'upload'
        }
    },
    upload_saved_stopped: {
        header: "Save and Upload",
        prompt: `Save and upload current configuration to Duro? This action will overwrite the current configuration and start the module if enabled.`,
        noBtn: "Cancel",
        yesBtn: {
            name: "Upload",
            action: 'upload'
        }
    },
    upload_saved_running: {
        header: "Module is Currently Running",
        prompt: `The module is currently running and must be stopped before uploading a new configuration.`,
        noBtn: "Cancel",
        yesBtn: {
            name: "Stop Module",
            action: 'stop'
        }
    },
    debug_running: {
        header: "Module is Currently Running",
        prompt: "The module is currently running and must be stopped before starting a debug session.",
        noBtn: "Cancel",
        yesBtn: {
            name: "Stop Module",
            action: 'stop'
        }
    },
}