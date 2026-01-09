const currentUser = {
    name: "Imran Khan", // 실제로는 서버 세션이나 HTML의 p 태그에서 가져올 수 있음
    image: "https://ui-avatars.com/api/?name=IK&background=f07d18&color=fff"
};

const wsUri = "ws://127.0.0.1:8080/ws/chat";
let websocket;

const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const btnSend = document.getElementById("btn-send-message");
const connDot = document.getElementById("connection-dot");

// 2. 페이지 로드 시 자동 연결
window.addEventListener("load", () => {
    initChat();
});

function initChat() {
    websocket = new WebSocket(wsUri);

    websocket.onopen = () => {
        // 연결 성공 시 점 색상 변경 및 입력창 활성화
        connDot.classList.replace("bg-red-500", "bg-green-500");
        chatInput.placeholder = "메시지를 입력하세요...";
        
        // [중요] 연결되자마자 내 로그인 정보를 서버에 알림
        const loginNotice = {
            nickname: currentUser.name,
            profileImage: currentUser.image // 서버에서 처리 가능하다면 추가 전달
        };
        websocket.send(JSON.stringify(loginNotice));
    };

    websocket.onmessage = (e) => {
        try {
            const rawData = JSON.parse(e.data);
            const payload = typeof rawData.payload === 'string' ? JSON.parse(rawData.payload) : rawData.payload;
            
            if (payload.nickname && !payload.message) {
                appendSystemMessage(`${payload.nickname}님이 입장하셨습니다.`);
            } else if (payload.message) {
                // 메시지 수신 (보낸 사람이 '나'인지 확인하여 정렬)
                appendChatMessage(payload.nickname || "Unknown", payload.message);
            }
        } catch (err) {
            console.error("채팅 데이터 처리 오류:", err);
        }
    };

    websocket.onclose = () => {
        connDot.classList.replace("bg-green-500", "bg-red-500");
        chatInput.placeholder = "연결이 끊겼습니다. 재시도 중...";
        setTimeout(initChat, 3000); // 3초 후 재연결 시도
    };
}

// 3. 메시지 전송 로직
function sendMessage() {
    const text = chatInput.value;
    if (text && websocket.readyState === WebSocket.OPEN) {
        // 내 닉네임을 포함해서 메시지 전송
        const msg = { 
            nickname: currentUser.name,
            message: text 
        };
        websocket.send(JSON.stringify(msg));
        chatInput.value = "";
    }
}

btnSend.addEventListener("click", sendMessage);
chatInput.addEventListener("keypress", (e) => { if (e.key === "Enter") sendMessage(); });

// 4. UI 렌더링 함수
function appendChatMessage(sender, text) {
    const isMe = sender === currentUser.name;
    const msgHTML = `
        
                <div class="flex gap-3 ${isMe ? 'flex-row-reverse' : ''} mb-4">
                <img src="https://ui-avatars.com/api/?name=${sender}&background=${isMe ? 'f07d18' : '3b82f6'}&color=fff" class="w-8 h-8 rounded-lg shrink-0">
                <div class="flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]">
                <p class="text-[10px] font-bold text-[var(--text-muted)] mb-1">${sender}</p>
                <div class="${isMe ? 'bg-[#f07d18] text-white rounded-tr-none' : 'bg-[var(--bg-input)] text-[var(--text-main)] rounded-tl-none'} 
                            p-3 rounded-2xl text-xs leading-relaxed shadow-sm 
                            inline-block 
                            min-width-[50px] 
                            w-max 
                            max-w-full 
                            break-words 
                           ">
                    ${text}
                </div>
            </div>
        </div>
    `;
    chatMessages.insertAdjacentHTML('beforeend', msgHTML);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function appendSystemMessage(text) {
    const sysHTML = `<div class="text-center my-2"><span class="text-[9px] bg-[var(--bg-input)] px-2 py-0.5 rounded-full text-gray-500 font-bold">${text}</span></div>`;
    chatMessages.insertAdjacentHTML('beforeend', sysHTML);
}