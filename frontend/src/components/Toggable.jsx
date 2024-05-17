import { useState, forwardRef, useImperativeHandle } from "react"


const Toggable = forwardRef((props, refs) => {


    const [visible, setVisible] = useState(false)
    const hideWhenVisible = { display: visible ? "none" : "" }
    const showWhenVisible = { display: visible ? "" : "none" }

    function toggleVisibility() {
        setVisible(!visible)
    }

    useImperativeHandle(refs, () => {
        return {toggleVisibility}
    })

    return (
        <div>
            <div style={hideWhenVisible}>
            <button onClick={() => setVisible(true)}>{props.buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {props.children}
                <button onClick={() => setVisible(false)}>cancel</button>

            </div>
        </div>
    )
})

export default Toggable