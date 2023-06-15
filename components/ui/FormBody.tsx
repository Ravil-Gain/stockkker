import * as React from "react";

export interface ILayoutProps {
  children: any;
  title: string;
  closeFn?: any;
  saveFn?: any;
}

export function FormBody(props: ILayoutProps) {
  const { children, title, closeFn, saveFn } = props;

  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none min-w-full">
        <div className="relative w-auto my-6 mx-auto min-w-96">
          {/*content*/}
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
            {/*header*/}
            <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
              <h3 className="text-3xl font-semibold">{title}</h3>
            </div>
            <div className="relative p-4 flex-auto">{children}</div>

            {(closeFn || saveFn) &&
              (
                <div className="flex items-center justify-end p-6 border-t border-solid border-slate-200 rounded-b">
                 { closeFn &&
                  <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={closeFn}
                  >
                    Close
                  </button>
                 } {
                  saveFn && 
                  <button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={saveFn}
                  >
                    Save
                  </button>
                 }
                </div>
              )}
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
    </>
  );
}
