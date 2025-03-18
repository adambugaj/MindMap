import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
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
  const [bulkText, setBulkText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("single");

  const { addDomain, addBulkDomains } = useDomainContext();

  const handleSingleSubmit = (e: React.FormEvent) => {
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

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!bulkText.trim()) {
      setError("Please enter at least one domain");
      return;
    }

    // Parse bulk text - each line should be in format: name,url
    const lines = bulkText.split("\n").filter((line) => line.trim());
    const domains = [];
    const errors = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const parts = line.split(",");

      if (parts.length < 2) {
        errors.push(`Line ${i + 1}: Invalid format. Use 'name,url'`);
        continue;
      }

      const domainName = parts[0].trim();
      let domainUrl = parts[1].trim();

      // Add https:// if not present
      if (
        !domainUrl.startsWith("http://") &&
        !domainUrl.startsWith("https://")
      ) {
        domainUrl = `https://${domainUrl}`;
      }

      try {
        // Validate URL
        new URL(domainUrl);

        domains.push({
          name: domainName,
          url: domainUrl,
          position: {
            x: initialPosition.x + ((i * 30) % 300),
            y: initialPosition.y + Math.floor(i / 10) * 30,
          },
        });
      } catch (err) {
        errors.push(`Line ${i + 1}: Invalid URL '${domainUrl}'`);
      }
    }

    if (errors.length > 0) {
      setError(errors.join("\n"));
      return;
    }

    if (domains.length === 0) {
      setError("No valid domains found");
      return;
    }

    // Add all domains
    addBulkDomains(domains);

    // Reset and close
    setBulkText("");
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Domains</DialogTitle>
          <DialogDescription>
            Add a single domain or bulk import multiple domains at once.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="single">Single Domain</TabsTrigger>
            <TabsTrigger value="bulk">Bulk Import</TabsTrigger>
          </TabsList>

          <TabsContent value="single">
            <form onSubmit={handleSingleSubmit} className="space-y-4 py-4">
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

              {error && activeTab === "single" && (
                <p className="text-sm text-destructive">{error}</p>
              )}

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
          </TabsContent>

          <TabsContent value="bulk">
            <form onSubmit={handleBulkSubmit} className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="bulk-domains">
                  Enter domains (one per line, format: name,url)
                </Label>
                <Textarea
                  id="bulk-domains"
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  placeholder="example1.com,https://example1.com\nexample2.com,https://example2.com"
                  className="min-h-[150px]"
                />
              </div>

              {error && activeTab === "bulk" && (
                <div className="text-sm text-destructive whitespace-pre-line">
                  {error}
                </div>
              )}

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Import Domains</Button>
              </DialogFooter>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AddDomainDialog;
