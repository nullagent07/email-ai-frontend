import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useState } from "react";
import type { AssistantProfile } from "~/types/email";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";

interface CreateThreadDialogProps {
  existingAssistants: AssistantProfile[];
  onSubmit: (data: {
    contact: {
      name: string;
      email: string;
      additionalInfo: string;
    };
    assistant: AssistantProfile | {
      name: string;
      description: string;
      instructions: string;
    };
    useExisting: boolean;
  }) => void;
  trigger: React.ReactNode;
}

export function CreateThreadDialog({ existingAssistants, onSubmit, trigger }: CreateThreadDialogProps) {
  const [step, setStep] = useState(1);
  const [open, setOpen] = useState(false);
  const [useExisting, setUseExisting] = useState(true);
  const [formData, setFormData] = useState({
    contact: {
      name: "",
      email: "",
      additionalInfo: "",
    },
    assistant: {
      name: "",
      description: "",
      instructions: "",
    },
    selectedAssistantId: existingAssistants[0]?.id || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
      return;
    }

    const assistant = useExisting
      ? existingAssistants.find((a) => a.id === formData.selectedAssistantId)!
      : formData.assistant;

    onSubmit({
      contact: formData.contact,
      assistant,
      useExisting,
    });

    setOpen(false);
    setStep(1);
    setFormData({
      contact: {
        name: "",
        email: "",
        additionalInfo: "",
      },
      assistant: {
        name: "",
        description: "",
        instructions: "",
      },
      selectedAssistantId: existingAssistants[0]?.id || "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {step === 1 ? "Contact Information" : "Assistant Configuration"}
            </DialogTitle>
            <DialogDescription>
              {step === 1
                ? "Enter the contact details for this thread"
                : "Configure the AI assistant for this thread"}
            </DialogDescription>
          </DialogHeader>

          {step === 1 ? (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  className="col-span-3"
                  value={formData.contact.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, name: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="col-span-3"
                  value={formData.contact.email}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: { ...formData.contact, email: e.target.value },
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="additionalInfo" className="text-right">
                  Additional Info
                </Label>
                <Textarea
                  id="additionalInfo"
                  className="col-span-3"
                  value={formData.contact.additionalInfo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      contact: {
                        ...formData.contact,
                        additionalInfo: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </div>
          ) : (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Assistant Type</Label>
                <div className="col-span-3">
                  <RadioGroup
                    value={useExisting ? "existing" : "new"}
                    onValueChange={(value) => setUseExisting(value === "existing")}
                    className="flex flex-col space-y-1"
                  >
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="existing" id="existing" />
                      <Label htmlFor="existing">Use Existing Assistant</Label>
                    </div>
                    <div className="flex items-center space-x-3">
                      <RadioGroupItem value="new" id="new" />
                      <Label htmlFor="new">Create New Assistant</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>

              {useExisting ? (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="assistant" className="text-right">
                    Select Assistant
                  </Label>
                  <select
                    id="assistant"
                    className="col-span-3 flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.selectedAssistantId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        selectedAssistantId: e.target.value,
                      })
                    }
                    required
                  >
                    {existingAssistants.map((assistant) => (
                      <option key={assistant.id} value={assistant.id}>
                        {assistant.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="assistantName" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="assistantName"
                      className="col-span-3"
                      value={formData.assistant.name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          assistant: {
                            ...formData.assistant,
                            name: e.target.value,
                          },
                        })
                      }
                      required={!useExisting}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      className="col-span-3"
                      value={formData.assistant.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          assistant: {
                            ...formData.assistant,
                            description: e.target.value,
                          },
                        })
                      }
                      required={!useExisting}
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="instructions" className="text-right">
                      Instructions
                    </Label>
                    <Textarea
                      id="instructions"
                      className="col-span-3"
                      value={formData.assistant.instructions}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          assistant: {
                            ...formData.assistant,
                            instructions: e.target.value,
                          },
                        })
                      }
                      required={!useExisting}
                    />
                  </div>
                </>
              )}
            </div>
          )}

          <DialogFooter>
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
                className="mr-auto"
              >
                Back
              </Button>
            )}
            <Button type="submit">
              {step === 1 ? "Next" : "Create Thread"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
