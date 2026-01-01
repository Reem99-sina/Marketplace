import { Dispatch, SetStateAction } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface CreateStoreFormProps {
  name: string;
  setName: Dispatch<SetStateAction<string>>;
  description: string;
  setDescription: Dispatch<SetStateAction<string>>;
  createStore: () => Promise<void>;
}

export function CreateStoreForm({
  name,
  setName,
  description,
  setDescription,
  createStore,
}: CreateStoreFormProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-bold">Create Your Store</h1>
      <Input
        placeholder="Store Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <Button onClick={createStore}>Create Store</Button>
    </div>
  );
}
