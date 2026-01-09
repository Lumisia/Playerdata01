// 테마 토글 로직
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-btn');
    const icon = themeBtn.querySelector('i');

    body.classList.toggle('light-mode');

    if (body.classList.contains('light-mode')) {
        icon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('cloudflow-theme', 'light');
    } else {
        icon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('cloudflow-theme', 'dark');
    }
}

// 초기 테마 로드
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('cloudflow-theme');
    if (savedTheme === 'light') toggleTheme();
});

// 채팅 토글 및 리사이즈
const toggleChatBtn = document.getElementById('toggle-chat-btn');
const closeChatBtn = document.getElementById('close-chat');
const editorChat = document.getElementById('editor-chat');
const chatResizer = document.getElementById('chat-resizer');

toggleChatBtn.addEventListener('click', () => {
    editorChat.classList.toggle('hidden');
    chatResizer.classList.toggle('hidden');
});

closeChatBtn.addEventListener('click', () => {
    editorChat.classList.add('hidden');
    chatResizer.classList.add('hidden');
});

let isResizing = false;
chatResizer.addEventListener('mousedown', () => {
    isResizing = true;
    document.body.style.cursor = 'col-resize';
    editorChat.style.transition = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!isResizing) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 250 && newWidth <= 600) {
        editorChat.style.width = `${newWidth}px`;
    }
});

document.addEventListener('mouseup', () => {
    isResizing = false;
    document.body.style.cursor = 'default';
    editorChat.style.transition = 'all 0.3s ease';
});

// 채팅 메시지 전송
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (text) {
        appendMessage('나', text, true);
        chatInput.value = '';
        setTimeout(() => {
            appendMessage('Sarah', '좋습니다! 수치 바로 수정해둘게요.', false);
        }, 1200);
    }
});

function appendMessage(sender, text, isMe) {
    const div = document.createElement('div');
    if (isMe) {
        div.className = 'flex flex-col gap-1 items-end';
        div.innerHTML = `
                    <div class="max-w-[90%] bg-[#f07d18] p-3 rounded-2xl rounded-tr-none shadow-lg shadow-orange-900/10">
                        <p class="text-xs text-white">${text}</p>
                    </div>
                    <span class="text-[9px] font-bold text-[var(--text-muted)] mr-1">오후 4:52</span>
                `;
    } else {
        div.className = 'flex items-start gap-3';
        div.innerHTML = `
                    <img src="https://ui-avatars.com/api/?name=SJ&background=3b82f6&color=fff" class="w-8 h-8 rounded-lg shrink-0">
                    <div class="flex flex-col gap-1">
                        <span class="text-[10px] font-bold text-[var(--text-muted)]">${sender}</span>
                        <div class="bg-[var(--bg-input)] border border-[var(--border-color)] p-3 rounded-2xl rounded-tl-none">
                            <p class="text-xs">${text}</p>
                        </div>
                    </div>
                `;
    }
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
