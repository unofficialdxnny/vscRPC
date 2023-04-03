import * as DiscordRPC from 'discord-rpc';
import * as path from 'path';

// Define the path to the language logos
const logosPath = path.join(__dirname, 'logos');

// Define the possible programming languages and their logos
const languages = [
  { name: 'C++', logo: path.join(logosPath, 'cpp.png') },
  { name: 'C#', logo: path.join(logosPath, 'csharp.png') },
  { name: 'Java', logo: path.join(logosPath, 'java.png') },
  { name: 'JavaScript', logo: path.join(logosPath, 'javascript.png') },
  { name: 'Python', logo: path.join(logosPath, 'python.png') },
  { name: 'TypeScript', logo: path.join(logosPath, 'typescript.png') },
];

// Initialize the DiscordRPC client
DiscordRPC.register('YOUR_APPLICATION_ID');
const rpc = new DiscordRPC.Client({ transport: 'ipc' });

// Define a function to set the presence based on the file being edited
function setPresence(filename: string) {
  // Determine the file extension to determine the programming language
  const ext = path.extname(filename).toLowerCase();
  const language = languages.find(l => l.name.toLowerCase() === ext.substr(1));

  // Set the presence with the language logo and file name
  rpc.setActivity({
    details: `Editing a ${language ? language.name : 'file'}`,
    largeImageKey: language ? path.basename(language.logo, path.extname(language.logo)) : 'code',
    largeImageText: language ? language.name : 'File',
    smallImageKey: 'vscode',
    smallImageText: 'Visual Studio Code'
  });
}

// When the client is ready, set the initial presence and start updating
rpc.on('ready', () => {
  console.log('DiscordRPC Ready!');
  setPresence(vscode.window.activeTextEditor.document.fileName);

  vscode.window.onDidChangeActiveTextEditor(editor => {
    if (editor) {
      setPresence(editor.document.fileName);
    }
  });

  setInterval(() => {
    setPresence(vscode.window.activeTextEditor.document.fileName);
  }, 15000);
});

// Login to DiscordRPC
rpc.login({ clientId: 'YOUR_APPLICATION_ID' }).catch(console.error);
