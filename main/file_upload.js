document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("files");
    const imagesDiv = document.getElementById("images");

    if (!fileInput) return; // 해당 HTML에 없으면 종료

    fileInput.addEventListener("change", async () => {
        const files = fileInput.files;
        const formData = new FormData();

        // 여러 파일 추가
        for (const file of files) {
            formData.append("files", file);
        }

        try {
            const res = await axios.post(
                "http://localhost:8080/upload-image",
                formData
            );

            if (res.data.success) {
                res.data.fileUrls.forEach(fileInfo => {
                    // 이미지
                    if (fileInfo.type && fileInfo.type.startsWith("image/")) {
                        const img = document.createElement("img");
                        img.src = `http://localhost:8080${fileInfo.url}`;
                        img.style.width = "200px";
                        //imagesDiv.appendChild(img); 연습 예제 때 사용한 코드 : 이미지를 디스플레이 하는 용도
                    }
                    // 비디오
                    else if (fileInfo.type && fileInfo.type.startsWith("video/")) {
                        const video = document.createElement("video");
                        video.src = `http://localhost:8080${fileInfo.url}`;
                        video.controls = true;
                        video.width = 300;
                        //imagesDiv.appendChild(video); 연습 예제 때 사용한 코드 : 동영상을 디스플레이 하는 용도
                    }
                    // 기타 파일
                    else {
                        const link = document.createElement("a");
                        link.href = `http://localhost:8080${fileInfo.url}`;
                        link.textContent = fileInfo.originalName || "다운로드";
                        link.target = "_blank";
                        //imagesDiv.appendChild(link);
                        //imagesDiv.appendChild(document.createElement("br"));
                    }
                });
            }
        } catch (e) {
            console.error("파일 업로드 실패", e);
        }
    });
});
