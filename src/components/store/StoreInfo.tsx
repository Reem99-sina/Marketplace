import { StoreDoc } from "@/models/Store";
import { Button } from "../ui/button";

interface StoreInfoProps {
  store: StoreDoc;
  refresh: () => Promise<void>;
  exit: () => Promise<void>;
}

export function StoreInfo({ store, refresh, exit }: StoreInfoProps) {

  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-bold">{store.name}</h1>
      <p>Products: {store.products?.length ?? 0}</p>
      <p>Orders: {store.orders?.length ?? 0}</p>

      <div className="flex gap-2">
        <Button onClick={refresh} variant="outline">
          Refresh
        </Button>
        <Button onClick={exit} variant="destructive">
          Exit Store
        </Button>
      </div>
    </div>
  );
}
