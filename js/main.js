
function switchView(viewId) {
    document.querySelectorAll('.content-view').forEach(view => {
        view.classList.remove('active');
    });

    const targetView = document.getElementById('view-' + viewId);
    if (targetView) {
        targetView.classList.add('active');
    }

    document.querySelectorAll('.nav-link, #nav-dashboard').forEach(link => {
        link.classList.remove('active');
        if (link.id === 'nav-dashboard') {
            link.classList.remove('bg-orange-500/10', 'text-[#f07d18]');
        }
    });

    const activeNav = document.getElementById('nav-' + viewId);
    if (activeNav) {
        activeNav.classList.add('active');
        if (viewId === 'dashboard') {
            activeNav.classList.add('bg-orange-500/10', 'text-[#f07d18]');
        }
    }
}

function toggleChat() {
    const sidebar = document.getElementById('chat-sidebar');
    sidebar.classList.toggle('open');
}

function toggleTheme() {
    document.body.classList.toggle('light-theme');
    const icon = document.getElementById('themeIcon');
    if (document.body.classList.contains('light-theme')) {
        icon.classList.replace('fa-moon', 'fa-sun');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
    }
}

function toggleNotifMenu() {
    const dropdown = document.getElementById('notif-dropdown');
    document.getElementById('profile-dropdown').classList.remove('active');
    dropdown.classList.toggle('active');
}

function toggleProfileMenu() {
    const dropdown = document.getElementById('profile-dropdown');
    document.getElementById('notif-dropdown').classList.remove('active');
    dropdown.classList.toggle('active');
}

// Modal Tab Switching Function
function switchModalTab(tabId) {
    // Update Sidebar UI
    document.querySelectorAll('.modal-sidebar-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('modal-nav-' + tabId).classList.add('active');

    // Update Content UI
    document.querySelectorAll('.modal-tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });
    document.getElementById('modal-tab-' + tabId).classList.add('active');
}

// Modal Functions
function openProfileModal() {
    document.getElementById('profile-dropdown').classList.remove('active');
    document.getElementById('profile-modal').classList.add('active');
}

function closeProfileModal() {
    document.getElementById('profile-modal').classList.remove('active');
}

function saveProfile() {
    const btn = event.currentTarget;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> 저장 중...';
    btn.disabled = true;

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
        closeProfileModal();
    }, 1000);
}

function handleLogout() {
    if (confirm("로그아웃 하시겠습니까?")) {
        location.reload();
    }
}

window.onclick = function (event) {
    if (!event.target.closest('#profile-container') && !event.target.closest('#notif-container')) {
        document.getElementById('profile-dropdown').classList.remove('active');
        document.getElementById('notif-dropdown').classList.remove('active');
    }
    const modal = document.getElementById('profile-modal');
    if (event.target === modal) {
        closeProfileModal();
    }
}
