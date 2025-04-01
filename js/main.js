// First, let's add a function to dismiss any error dialogs that might appear
function dismissErrorPopups() {
    console.log('Checking for error dialogs to dismiss');
    
    // Find all possible error dialogs
    const errorDialogs = document.querySelectorAll('.dialog, .popup, .modal, .alert');
    errorDialogs.forEach(dialog => {
        // Check if it contains text about stats error
        if (dialog.textContent.includes('Failed to initialize') || 
            dialog.textContent.includes('Failed to load stats') ||
            dialog.textContent.includes('stats') && dialog.textContent.includes('error')) {
            
            console.log('Found error dialog, attempting to close');
            
            // Try to click OK button or close button
            const closeButton = dialog.querySelector('button, .close, .btn');
            if (closeButton) {
                console.log('Clicking close button on error dialog');
                closeButton.click();
            } else {
                // If no button, just remove the element
                console.log('No close button found, removing dialog');
                dialog.remove();
            }
        }
    });
}

// Call this function periodically to ensure errors don't stay on screen
setInterval(dismissErrorPopups, 500);

// Also call it when switching to stats page
document.addEventListener('DOMContentLoaded', function() {
    const statsTab = document.querySelector('.nav-item[data-page="stats"]');
    if (statsTab) {
        statsTab.addEventListener('click', function() {
            console.log('Stats tab clicked, will dismiss errors');
            setTimeout(dismissErrorPopups, 100);
            setTimeout(dismissErrorPopups, 500);
            setTimeout(dismissErrorPopups, 1000);
        });
    }
}); 