export default function SubmitButton({ isDisabled, clickHandler, children }) {
    return (
        <button type="submit" disabled={isDisabled} onClick={clickHandler}>{children}</button>
    );
}