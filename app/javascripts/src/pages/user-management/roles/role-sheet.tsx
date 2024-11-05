import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import { resourceFormSchema, ResourceFormValues } from './resourceFormSchema'; // Import form schema
import { update, create } from '@/apis/categoriesApi';
import { Icons } from "@/components/icons";
import { CommonAlert } from "@/components/CommonAlert"
import { ResourceForm } from "./form"

interface RoleProps {
  resource?: Resource; // category is optional now
  onSave: (resource: ResourceFormValues) => void;
  onOpenChange?: (isOpen: boolean) => void;
}

export function RoleSheet({ modelName, resource, onSave, ...props }: CategoryProps) {
  return (
    <Dialog {...props}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{resource ? `Edit ${modelName}` : `New ${modelName}`}</DialogTitle>
          <DialogDescription>
            {`Manage your ${modelName} here.
              You can add new ${modelName}, edit existing ones, or remove ${modelName}
              as needed. Click save to apply your changes.`}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ResourceForm resource={resource} onSave={onSave} { ...props } />
        </div>
        <DialogFooter>

        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}