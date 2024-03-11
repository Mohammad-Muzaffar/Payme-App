import { Link } from "react-router-dom"

export const BottomWarning = ({label, buttonText, to}) => {
    return(
        <div className="flex justify-center py-2 text-sm">
            <div>{label}</div>
            <div>
                <Link className="pointer underline cursor-pointer" to={to}>{buttonText}</Link>
            </div>
        </div>
    )
}