export const InputBox = ({label, placeholder,onChange}) => {
    return(
       <div>
            <div className="font-medium text-left py-2 text-sm">
                {label}
            </div>
            <div>
                <input placeholder={placeholder} className="py-1 px-2 w-full border rounded border-slate-200"onChange={onChange}/>
            </div>
       </div>
    );
}