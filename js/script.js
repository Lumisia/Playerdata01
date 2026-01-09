let socket;
        socket = new WebSocket('wss://www.cheeseduck.kro.kr:443/ws/chat');  // 서버 주소

        // 랜덤 색상
        function random() {
              let red = Math.floor(Math.random() * 256);
              let green = Math.floor(Math.random() * 256);
              let blue = Math.floor(Math.random() * 256);
            return `rgb(${red}, ${green}, ${blue})`;
        }

        let cursor = document.getElementById("cursor");
        let mouse;

        const senderId = Math.floor(Math.random() * 9) + 1; 
        const myColor = random(); // 내 색상을 미리 결정
        let editorChangeFromRemote = false;

        console.log(`내 ID: ${senderId}, 내 색상: ${myColor}`);

        // 접속했을 때 실행되는 코드 추가
        //      접속됨이라고 출력
        socket.onopen = () => {
            console.log('Connected to WebSocket');
        };


        // 메시지를 받았을 때 실행되는 코드 추가
        //      만약에 마우스 커서 dom을 저장할 변수가 비어있으면
        //          div dom 생성 후 변수에 저장
        //          생성한 dom에 mouse라는 클래스 이름 추가
        //          id가 cursor인 dom에 생성한 dom을 추가
        //      그렇지 않으면
        //          mouse dom의 style에서 left, top의 위치를 전달받은 x, y로 설정

        document.addEventListener("mousemove", (event) => {
            const x = event.clientX
            const y = event.clientY


            // 만약에 소켓이 비어있지 않고 소켓의 readyState가 WebSocket.OPEN이면
            //      마우스 커서의 x, y 값을 원하는 양식을 만들어서 전송
            if (socket && socket.readyState === WebSocket.OPEN) {
                const message = {
                    senderId : senderId,
                    color: myColor,
                    left: x,
                    top: y
                }
                socket.send(JSON.stringify(message));
            }
        })

        //Initialize Quill editor

        // let socket;
        // socket = new WebSocket('ws://localhost:8080/ws/chat');  // 서버 주소

        socket.onopen = () => {
            console.log("connect to websocket")
        }

        // 2. Quill 에디터 설정
        const quill = new Quill('#editor', {
            theme: 'snow',
            placeholder: '내용을 입력하세요...'
        });

        quill.on('text-change', (delta, oldDelta, source) => {
            if (source == 'user' && !editorChangeFromRemote) {
                if (socket && socket.readyState === WebSocket.OPEN) {
                    socket.send(JSON.stringify({ senderId: senderId, delta: delta }));
                }
            }
        });

        socket.onmessage = (event) => {
            const recv = JSON.parse(event.data);
            // console.log(recv.payload);
            const payload = JSON.parse(recv.payload);
            const recvSenderId = payload.senderId;
            const delta = payload.delta;

            // // 보낸 사람이랑 받는 사람이 다르면 업데이트
            // if (senderId !== recvSenderId) {
            //     editorChangeFromRemote = true;
            //     quill.updateContents(delta);
            //     editorChangeFromRemote = false;
            // }
            if (delta && delta.ops) {
                // 보낸 사람이랑 받는 사람이 다르면 업데이트
                if (senderId !== recvSenderId) {
                    editorChangeFromRemote = true;
                    quill.updateContents(delta);
                    editorChangeFromRemote = false;
                }

                // ops 배열의 길이를 체크할 때도 안전하게 확인
                if (delta.ops.length > 1) {
                    const range = {
                        index: delta.ops[0].retain || 0, // retain이 없을 경우 대비
                        length: 0
                        };
                    }
            } else {
                // 2. 만약 delta가 없다면 마우스 좌표 데이터일 확률이 높음
                // 여기서 마우스 커서 업데이트 로직을 처리하면 좋습니다.
                if (!mouse) {
                    mouse = document.createElement("div");
                    mouse.className = "mouse";
                    cursor.appendChild(mouse);
                    mouse.style.backgroundColor = payload.color;
                    mouse.innerText = recvSenderId;
                } else {
                    let recv = JSON.parse(event.data);
                    let payload = JSON.parse(recv.payload);
                    // 수신부 로직 수정
                    mouse.style.left = (payload.left - 10) + "px"; // 반지름만큼 이동
                    mouse.style.top = (payload.top - 10) + "px";

                    // mouse.style.left = payload.left + "px";
                    // mouse.style.top = payload.top + "px";
                }
            }
        }

// 테마 토글 등 UI 로직 (기존 코드와 동일)
document.getElementById('theme-btn').onclick = () => {
    document.body.classList.toggle('light-mode');
};