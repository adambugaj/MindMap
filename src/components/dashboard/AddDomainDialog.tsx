import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDomainContext } from "@/context/DomainContext";

interface AddDomainDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPosition?: { x: number; y: number };
}

const AddDomainDialog = ({
  open = false,
  onOpenChange = () => {},
  initialPosition = { x: 100, y: 100 },
}: AddDomainDialogProps) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("https://");
  const [error, setError] = useState<string | null>(null);

  const { addDomain } = useDomainContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      setError("Domain name is required");
      return;
    }

    try {
      // Check if URL is valid
      new URL(url);

      // Add domain
      addDomain({
        name,
        url,
        position: initialPosition,
      });

      // Reset form and close dialog
      setName("");
      setUrl("https://");
      setError(null);
      onOpenChange(false);
    } catch (err) {
      setError("Please enter a valid URL");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Domain</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="domain-name">Domain Name</Label>
            <Input
              id="domain-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="example.com"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="domain-url">Domain URL</Label>
            <Input
              id="domain-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Domain</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddDomainDialog;
