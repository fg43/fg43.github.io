const calcContainer = document.querySelector("#calculator-container");
const root = ReactDOM.createRoot(calcContainer);

function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function isNegative(b) {
    return b ? -1 : 1;
}

const ops = [
    "+",
    "-",
    "*",
    "/"
]

class Calculator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            text: "",
            number: 0.0,
            memory: 0.0,
            lastOp: "",
            dec: 0,
            neg: false,
            preset: 1
        }
        this.more = this.more.bind(this);
        this.decimal = this.decimal.bind(this);
        this.clearAll = this.clearAll.bind(this);
        this.clear = this.clear.bind(this);
        this.equals = this.equals.bind(this);
        this.operation = this.operation.bind(this);
        this.invertSign = this.invertSign.bind(this);
        this.perc = this.perc.bind(this);
    }

    invertSign() {
        this.setState(function (state) {
            let index = state.text.lastIndexOf(String(state.number));
            return {
                number: -1 * state.number,
                text: [...state.text.slice(0, index), String(-1 * state.number)]
            }
        });
    }

    more(event) {
        this.setState(function (state) {
            switch (state.lastOp) {
                case ("="): return {
                    number: parseInt(event.target.value),
                    text: event.target.value,
                    lastOp: ""
                }
                default: if (state.dec > 0) {
                    return {
                        number: state.number + parseInt(event.target.value) / (10 ** state.dec),
                        text: state.text + event.target.value,
                        dec: state.dec + 1
                    }
                } else {
                    return {
                        number: state.number * 10 + parseInt(event.target.value),
                        text: state.text + event.target.value
                    }
                }
            }
        })
    }

    decimal() {
        this.setState(function (state) {
            return {
                text: state.text + ".",
                dec: 1
            }
        })
    }

    clearAll() {
        this.setState({
            number: 0.0,
            dec: false,
            text: "",
            memory: 0.0,
            lastOp: "",
            neg: false
        })
    }

    clear() {
        this.setState(function (state) {
            let index = state.text.lastIndexOf(String(state.number));
            return {
                number: 0.0,
                dec: false,
                text: state.text.slice(0, index)
            }
        })
    }

    operation(e) {
        this.setState(function (state) {
            let op = e.target.value;
            if (isNumeric(state.text[state.text.length - 1])) {
                for (var o in ops) {
                    if (state.lastOp == ops[o]) {
                        return {
                            memory: eval(String(state.memory) + ops[o] + "(" + String(isNegative(state.neg) * state.number) + ")"),
                            number: 0.0,
                            text: state.text + op,
                            lastOp: op,
                            dec: 0.0
                        }
                    }
                }
                return {
                    memory: state.number,
                    number: 0.0,
                    text: state.text + op,
                    lastOp: op,
                    dec: 0.0,
                    neg: false
                }
            } else {
                if (op == "-" && ops.includes(state.lastOp) /*&& state.text[state.text.length-1]!="-"*/) {
                    return {
                        memory: state.memory,
                        number: 0.0,
                        text: state.text + "-",
                        lastOp: state.text[state.text.length - 1],
                        neg: !state.neg
                    }
                }
                switch (state.text[state.text.length - 1]) {
                    case ("-"): {
                        let g = 1;
                        let t = state.text.slice(0, state.text.length)
                        while (t[t.length - g] === "-") {
                            g++;
                        }
                        return {
                            memory: state.memory,
                            number: 0.0,
                            text: state.text.slice(0, state.text.length - g) + op,
                            lastOp: op,
                            neg: !state.neg
                        }
                    }
                    case (op): {
                        return {
                            memory: state.memory,
                            number: state.number,
                            text: state.text,
                            lastOp: state.lastOp
                        }
                    }
                    default: return {
                        memory: state.memory,
                        number: 0.0,
                        text: state.text.slice(0, state.text.length - 1) + op,
                        lastOp: op
                    }
                }
            }
        })
    }

    equals() {
        this.setState(function (state) {
            for (var o in ops) {
                if (state.lastOp == ops[o]) {
                    return {
                        number: eval(String(state.memory) + ops[o] + "(" + String(isNegative(state.neg) * state.number) + ")"),
                        memory: 0.0,
                        text: String(eval(String(state.memory) + ops[o] + "(" + String(isNegative(state.neg) * state.number) + ")")),
                        lastOp: "="
                    }
                }
            }
        })
    }

    perc() {
        this.setState(function (state) {
            let index = state.text.lastIndexOf(String(state.number));
            return {
                number: 0.01 * state.number,
                text: [...state.text.slice(0, index), String(0.01 * state.number)]
            }
        })
    }

    render() {
        const preset2col = "hsl(0deg, 0%, 10%)";

        const bRow = {
            display: "flex",
            gap: "4px",
            alignItems: "center",
            justifyContent: "center",
            paddingTop: "24px",
            height: "10%"
        }

        const wrap = {
            color: "white",
            textShadow: "1px 1px 2px black, -1px 1px 2px black, 1px -1px 2px black, -1px -1px 2px black",
            width: this.state.preset === 0 ? "20vw" : "20vw",
            height: "50vh",
            minHeight: "350px",
            minWidth: this.state.preset === 0 ? "640px" : "240px",
            maxHeight: this.state.preset === 0 ? "400px" : "360px",
            maxWidth: this.state.preset === 0 ? "750px" : "260px",
            margin: "auto auto",
            border: "3px solid black",
            backgroundImage: this.state.preset === 0 ? "radial-gradient(farthest-corner at 10% 10%, #adfdff 0%, #2300a9 100%)" : "",
            backgroundColor: this.state.preset === 0 ? "" : preset2col,
            boxShadow: this.state.preset === 0 ? "10px 10px 6px 1px #000044" : "8px 8px 4px 0px #000000",
            paddingTop: "30px",
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            fontFamily: "Arial, sans-serif"
        }

        const answerStyle = {
            border: this.state.preset === 0 ? "3px solid black" : "",
            width: "60%",
            display: "inline-block",
            backgroundImage: this.state.preset === 0 ? "radial-gradient(farthest-corner at 10% 10%, hsl(240deg, 80%, 90%) 100%, hsl(240deg, 80%, 30%) 0%)" : "",
            textAlign: "right",
            paddingRight: this.state.preset === 0 ? "20px" : "0px"
        }

        const bs = this.state.preset === 0 ? (n) => ({
            transform: n === 4 ? "translate(0%, 200%)" : "",
            fontSize: n === 4 ? "14px" : ""
        }) : (n) => ({
            backgroundImage: n === 1 ? "linear-gradient(hsl(0deg, 0%, 20%) 100%, #ffffff 0%)" : n === 2 ? "linear-gradient(hsl(40deg, 100%, 60%) 100%, #ffffff 0%)" : "linear-gradient(hsl(0deg, 0%, 30%) 100%, #aaaaaa 0%)",
            borderRadius: "50px",
            border: "none",
            color: "white",
            width: n === 4 ? "65px" : "42px",
            height: n === 4 ? "65px" : "42px",
            transform: n === 4 ? "translate(0%, 100%)" : "",
            fontSize: n === 4 ? "14px" : ""
        })

        return (
            <div>
                <div style={wrap}>
                    <div style={answerStyle}>
                        <p style={{ width: "100%", height: "10px" }}>{this.state.text}</p>
                        <h1 id="display">{this.state.number}</h1>
                    </div>
                    <div style={{ width: "100%", height: "60%", position: "relative", top: "0%" }}>
                        <div style={bRow}>
                            <button id="clearAll" onClick={this.clearAll} style={bs(3)}>CE</button>
                            <button id="clear" onClick={this.clear} style={bs(3)}>C</button>
                            <button id="percent" onClick={this.perc} style={bs(3)}>%</button>
                            <button id="divide" onClick={this.operation} value={"/"} style={bs(2)}>/</button>
                        </div>
                        <div style={bRow}>
                            <button id="seven" onClick={this.more} value={7} style={bs(1)}>7</button>
                            <button id="eight" onClick={this.more} value={8} style={bs(1)}>8</button>
                            <button id="nine" onClick={this.more} value={9} style={bs(1)}>9</button>
                            <button id="multiply" onClick={this.operation} value={"*"} style={bs(2)}>x</button>
                        </div>
                        <div style={bRow}>
                            <button id="four" onClick={this.more} value={4} style={bs(1)}>4</button>
                            <button id="five" onClick={this.more} value={5} style={bs(1)}>5</button>
                            <button id="six" onClick={this.more} value={6} style={bs(1)}>6</button>
                            <button id="subtract" onClick={this.operation} value={"-"} style={bs(2)}>-</button>
                        </div>
                        <div style={bRow}>
                            <button id="one" onClick={this.more} value={1} style={bs(1)}>1</button>
                            <button id="two" onClick={this.more} value={2} style={bs(1)}>2</button>
                            <button id="three" onClick={this.more} value={3} style={bs(1)}>3</button>
                            <button id="add" onClick={this.operation} value={"+"} style={bs(2)}>+</button>
                        </div>
                        <div style={bRow}>
                            <button id="change-sign" onClick={this.invertSign} style={bs(3)}>+/-</button>
                            <button id="zero" onClick={this.more} value={0} style={bs(1)}>0</button>
                            <button id="decimal" onClick={this.decimal} value="." style={bs(3)}>.</button>
                            <button id="equals" onClick={this.equals} style={bs(2)}>=</button>
                        </div>
                    </div>
                    <button style={bs(4)} onClick={(e) => {
                        this.setState((state) => {
                            return { preset: state.preset === 0 ? 1 : 0 }
                        })
                    }}>New Style!</button>
                </div>
            </div>
        )
    }
}

root.render(<Calculator ></Calculator>)