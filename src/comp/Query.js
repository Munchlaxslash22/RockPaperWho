import {useState} from "react";

export default function Query() {
    const [query, setQuery] = useState("");

    function handleSubmit() {
    }

    return (
        <div>
        <form onSubmit={handleSubmit}>
            <input type={"text"} onChange={e => setQuery(e.target.value)} placeholder={"What is the best thing you can think of?"} />
        </form>
        </div>
    );
}