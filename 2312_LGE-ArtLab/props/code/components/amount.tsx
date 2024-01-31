import React from "react";

interface Props {
    method:string,
    clickEvent: (method:string, type:number)=>void;
};

const Amount: React.FC<Props> = (params) => {
    return (
        <div>
            <button onClick={() => params.clickEvent(params.method, 0)}>set 0 eth</button>
            <button onClick={() => params.clickEvent(params.method, 1)}>+ 1 eth</button>
            <button onClick={() => params.clickEvent(params.method, 5)}>+ 5 eth</button>
            <button onClick={() => params.clickEvent(params.method, 10)}>+ 10 eth</button>
            <button onClick={() => params.clickEvent(params.method, 100)}>+ 100 eth</button>
            <button onClick={() => params.clickEvent(params.method, 500)}>+ 500 eth</button>
            <button onClick={() => params.clickEvent(params.method, 1000)}>+ 1000 eth</button>
        </div>
    )
}

export default Amount;
