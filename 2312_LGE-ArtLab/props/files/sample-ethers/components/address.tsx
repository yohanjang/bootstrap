import React from "react";

interface Props {
    method:string,
    clickEvent: (method:string, type:number)=>void;
};

const Address: React.FC<Props> = (params) => {
    return (
        <div>
            <button onClick={() => params.clickEvent(params.method, 0)}>set account#0</button>
            <button onClick={() => params.clickEvent(params.method, 1)}>set account#1</button>
            <button onClick={() => params.clickEvent(params.method, 2)}>set account#2</button>
            <button onClick={() => params.clickEvent(params.method, 3)}>set account#3</button>
            <button onClick={() => params.clickEvent(params.method, 4)}>set account#4</button>
        </div>
    )
}

export default Address;
