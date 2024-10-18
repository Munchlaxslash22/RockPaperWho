function App() {
return (
<div className="App">
        <center>
            <div id="center">
                test
                <textarea readOnly id="chat">
                    Lorem Ipsum fiddle faddle fipsum she strolli on my friholli until the gypsi dips em.
                </textarea>
                <form onSubmit={chat}>
                <textarea placeholder={"Type words"} autoFocus id="typeChat">
                </textarea>
                    <button>
                        Chat
                    </button>
                </form>
            </div>
        </center>
</div>
);
}

function chat(e) {
    e.preventDefault();
    // You got this Jack! You can do it! o/
}

function sendChat(string, self){

}

export default App;
