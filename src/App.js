import logo from './logo.svg';
import './App.css';

function App() {
return (
<div className="App">
        <header className="App-header">
            <center>
                <div id="center">
                    test

                    <textarea readOnly id="chat">
                        bob
                    </textarea>
                    <textarea onSubmit={chat} autoFocus id="typeChat">
                    </textarea>
                </div>
            </center>
    </header>
</div>
);
}

function chat() {
    document.querySelector('textarea#chat').innerHTML += this.innerHTML;
}

export default App;
