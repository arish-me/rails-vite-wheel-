import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icons } from "@/components/icons";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { fetch, update } from "@/apis/accountsApi"; // Update the endpoint if necessary
import { toast } from "sonner";

export function OrganizationForm() {
  const [organization, setOrganization] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);

  const accountFormSchema = z.object({
    name: z.string().min(1, { message: "Organization name is required" }),
    subdomain: z.string().min(1, { message: "Organization subdomain is required" }),
    phone_number: z
      .string()
      .regex(/^\d{10}$/, { message: "Phone number must be 10 digits" }),
  });

  const form = useForm({
    resolver: zodResolver(accountFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      subdomain: "",
      phone_number: "",
    },
  });

  // Fetch organization data on component mount
  useEffect(() => {
    const fetchResource = async () => {
      setIsProcessing(true);
      try {
        const response = await fetch();
        const fetchedOrganization = response.data.account;
        setOrganization(fetchedOrganization);

        // Reset form values after organization data is fetched
        form.reset({
          name: fetchedOrganization?.name || "",
          subdomain: fetchedOrganization?.subdomain || "",
          phone_number: fetchedOrganization?.phone_number || "",
        });
      } catch (error) {
        console.warn(error);
        toast.error("Error fetching profile");
      } finally {
        setIsProcessing(false);
      }
    };

    fetchResource();
  }, [form]);

  async function onSubmit(data) {
    setIsProcessing(true);
    try {
      const response = await update(organization.id, { account: data });
      const { notice } = response.data;
      toast.success(notice);
      setOrganization(data); // Update organization state with new data
      form.reset(data); // Resetting form with updated values
    } catch (err) {
      const { errors } = err.response.data;
      toast.error(errors);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <>
      {isProcessing ? (
        <div className="text-center py-4">
          <Icons.spinner className="h-6 w-6 animate-spin" aria-hidden="true" />
          <p>Loading...</p>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Company Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subdomain"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="Subdomain" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="tel"
                      placeholder="Phone Number"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={isProcessing} className="w-full">
              {isProcessing && (
                <Icons.spinner
                  className="mr-2 h-4 w-4 animate-spin"
                  aria-hidden="true"
                />
              )}
              Save
            </Button>
          </form>
        </Form>
      )}
    </>
  );
}
