'use client';


import { forwardRef , useId , useState} from "react";
import { Eye , EyeOff } from "lucide-react";


export const PasswordInput = forwardRef(function PasswordInput(
    {label , error , ...props },
    ref
) {
    const [show , setShow] = useState(false);
    const id = useId();
    return (
        <div className="space-y-1.5">
            {label && (
                <label htmlFor={id} className="text-sm">
                    {label}
                </label>
            )}
            <div className="relative">
                <input ref={ref} id={id} type={show ? "text" : "password"} {...props} className="peer" />
                <button type="button" onClick={() => setShow((s) => !s)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground">
                    {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    {show ? "Hide" : "Show"}
                </button>
            </div>
            {error && (
                <p className="text-xs font-medium text-destructive">{typeof error === "string" ? error : error?.message}</p>
            )}
        </div>
    )
});