import ConsumablesForm from "@/components/consumables/ConsumablesForm";
import { Loading } from "@/components/ui/Loading";
import { getConsumables } from "@/firebase/functions/consumables";
import { useEffect, useState } from "react";

export default function Home() {
  const [consumables, setConsumables] = useState<any[]>([]);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    getConsumables().then((data) => {
      setConsumables(data);
      setLoading(false);
    });
  }, []);


  
  return (
    <>
      <div className="flex items-center  justify-between mt-10">
        <p className="text-xl font-semibold">Consumables</p>
        <ConsumablesForm />
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 place-items-center">
          {consumables.length > 0 &&
            consumables.map((consumables, index) => (
              <div
                key={index}
                className="bg-white border-8 border-sky-500 m-2 p-2"
              >
                {/* Add lists of Consumables */}
                <div className="text-lg text-center"> {consumables.name} </div>
              </div>
            ))}
        </div>
      )}
    </>
  );
}
