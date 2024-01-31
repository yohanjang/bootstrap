import React from "react";

interface Props {
    method:string,
    token?:string,
    clickEvent: (method:string, type:number)=>void;
};

const Amount: React.FC<Props> = (params) => {
    function getTokenName():string {
        if (params.token) {
            return params.token;
        }
        return "eth";
    };
    return (
        <div>
            <button onClick={() => params.clickEvent(params.method, 0)}>set 0 {getTokenName()}</button>
            <button onClick={() => params.clickEvent(params.method, 1)}>+ 1 {getTokenName()}</button>
            <button onClick={() => params.clickEvent(params.method, 5)}>+ 5 {getTokenName()}</button>
            <button onClick={() => params.clickEvent(params.method, 10)}>+ 10 {getTokenName()}</button>
            <button onClick={() => params.clickEvent(params.method, 100)}>+ 100 {getTokenName()}</button>
            <button onClick={() => params.clickEvent(params.method, 500)}>+ 500 {getTokenName()}</button>
            <button onClick={() => params.clickEvent(params.method, 1000)}>+ 1000 {getTokenName()}</button>
        </div>
    )
}

export default Amount;
