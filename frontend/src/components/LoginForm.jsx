
function LoginForm({onSubmit, username, password, onUsernameChange, onPasswordChange}) {
    return (<>
        <form onSubmit={onSubmit}>
            <div>
                username
                <input
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => { onUsernameChange(target.value) }}
                />
            </div>
            <div>
                password
                <input
                    type="text"
                    value={password}
                    name="Password"
                    onChange={({ target }) => { onPasswordChange(target.value) }}
                />
            </div>
            <button type="submit">submit</button>
        </form>
    </>)
}
// function LoginForm() {
//     return <p>hi</p>
// }
export default LoginForm