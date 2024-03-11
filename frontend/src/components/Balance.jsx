export const Balance = ({value}) => {
    return(
        <div className="flex my-2">
            <div className="font-bold text-lg">Your balance</div>
            <div className="font-semibold ml-4 text-lg">Rs {value}.00</div>
        </div>
    );
}