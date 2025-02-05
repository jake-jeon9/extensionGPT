import * as vscode from 'vscode';

const model  = {
    GPT_4O_MINI : "gpt-4o-mini",
    GPT_35_turbo : "gpt-3.5-turbo",
    TEXT_EMBEDDING_3_SMALL : "text-embedding-3-small",
    DELL_e_3 : "dall-e-3",
    TTS_1 : "tts-1",
};

const role = {
    USER : "user", //EX Write a haiku about programming.
    DEVELOPER : "developer", //EX 
    ASSISTANT : "assistant",
}

// ChatGPT API 호출 함수
async function fetchChatGPTResponse(prompt: string): Promise<string> {

    const apiKey = "";

    const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: model.GPT_35_turbo,
            response_format : { "type": "json_object" },
            messages: [
                {   role: role.DEVELOPER, 
                    content: "You are a helpful assistant." },
                {
                    role: role.USER,
                    content: `${prompt}`,
                },
            ],
            store: true,
            
        }),
    });

    const data : any = await response.json();
    return data.choices[0].message.trim();
}

// WebView 콘텐츠 구성 함수
function getWebViewContent(): string {
	console.log("getWebViewContent open")
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ChatGPT VSCode Extension</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            .container {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            textarea {
                width: 100%;
                height: 150px;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
            button {
                padding: 10px;
                background-color: #007acc;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            }
            button:hover {
                background-color: #005f99;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>ChatGPT Code Assistant</h2>
            <label for="task">Choose a task:</label>
            <select id="task">
                <option value="explain">Explain Code</option>
                <option value="refactor">Refactor Code</option>
                <option value="suggest">Suggest Name</option>
                <option value="optimize">Optimize Code</option>
            </select>

            <label for="codeInput">Paste your code here:</label>
            <textarea id="codeInput"></textarea>

            <button id="submitBtn">Submit</button>

            <h3>Response:</h3>
            <pre id="response"></pre>
        </div>

        <script>
            const vscode = acquireVsCodeApi();

            document.getElementById('submitBtn').addEventListener('click', () => {
                const task = document.getElementById('task').value;
                const code = document.getElementById('codeInput').value;

                if (!code) {
                    document.getElementById('response').textContent = 'Please enter some code.';
                    return;
                }

                vscode.postMessage({
                    command: 'runTask',
                    task: task,
                    code: code
                });
            });
        </script>
    </body>
    </html>
    `;
}

var panel: vscode.WebviewPanel | undefined = undefined;

// WebView 활성화 및 메시지 처리
export function activate(context: vscode.ExtensionContext) {
	console.log("activate run");
	// alert on right bottom to explain this Extension
	context.subscriptions.push(vscode.commands.registerCommand('test.helloWorld', () => {
		console.log("activate helloWorld run");
		vscode.window.showInformationMessage('hihi');
	}));


    let disposable = vscode.commands.registerCommand('test.chatGPT', async () => {
		console.log("activate registerCommand run");

		if(panel){
			panel.reveal(vscode.ViewColumn.One);
		}else{
			panel = vscode.window.createWebviewPanel(
				'chatGPTWebView', 
				'ChatGPT Code Assistant', 
				vscode.ViewColumn.Beside, 
				{
					enableScripts: true,
					retainContextWhenHidden: true, // 웹뷰가 비활성화될 때 상태를 유지합니다.
				}
			);

			panel.webview.html = getWebViewContent();

			panel.webview.onDidReceiveMessage(
				async (message) => {
					// if (message.command === 'runTask') {
						const { task, code } = message;
	
						let prompt = '';
						switch (task) {
							case 'explain':
								prompt = `Please explain this code: ${code}`;
								break;
							case 'refactor':
								prompt = `Refactor this code: ${code}`;
								break;
							case 'suggest':
								prompt = `Suggest a name for this function/variable/class: ${code}`;
								break;
							case 'optimize':
								prompt = `Optimize this code: ${code}`;
								break;
						}
	
						const response = await fetchChatGPTResponse(prompt);
						if(panel){
							panel.webview.postMessage({ command: 'showResponse', response: response });
						}
					// }
				},
				undefined,
				context.subscriptions
			);

			panel.onDidDispose(() => {
				panel = undefined;
			  });
		}
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
