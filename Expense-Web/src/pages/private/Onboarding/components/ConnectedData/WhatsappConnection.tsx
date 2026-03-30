import React from "react";
import { useForm } from "react-hook-form";
import type { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { connectWhatsapp } from "@/services/connection.service";
import { formatApiError, notifyError, notifySuccess } from "@/lib/utils";
import { CONNECTIONS_LIST_API_QUERY_KEY } from "../../helpers/constants/onboarding";
import {
  whatsAppConnectorForm,
  type WhatsAppConnectorFormValues,
} from "../../helpers/zod-schema/onboardingSchema";

import FormInputField from "@/components/common/FormInputField";

interface WhatsappConnectionProps {
  setWhatsappConnectDialog: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WhatsappConnection: React.FC<WhatsappConnectionProps> = ({
  setWhatsappConnectDialog,
}) => {
  const form = useForm<WhatsAppConnectorFormValues>({
    resolver: zodResolver(whatsAppConnectorForm),
    defaultValues: {
      phone_number_id: "",
      whatsapp_token: "",
    },
  });

  const queryClient = useQueryClient();

  const { mutate: connectionMutate, isPending: isConnectionPending } =
    useMutation({
      mutationFn: (data: WhatsAppConnectorFormValues) => connectWhatsapp(data),
      onSuccess: (response: WhatsappConnectionResponse) => {
        notifySuccess(
          "Success connecting",
          `Whatsapp connection succeed for ${response.phone_number_id}`,
        );
        setWhatsappConnectDialog(false);
        queryClient.invalidateQueries({
          queryKey: [CONNECTIONS_LIST_API_QUERY_KEY],
        });
      },
      onError: (error: AxiosError<APIErrorResponse>) => {
        notifyError("Failed to connect whatsapp", formatApiError(error));
      },
    });

  const onSubmit = (formData: WhatsAppConnectorFormValues) => {
    connectionMutate(formData);
  };

  return (
    <div className="mt-3">
      <form className="space-y-5" onSubmit={form.handleSubmit(onSubmit)}>
        <FormInputField
          control={form.control}
          label="Phone number ID"
          name="phone_number_id"
          readOnly={isConnectionPending}
          placeholder="Enter phone number ID here"
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
        />
        <FormInputField
          control={form.control}
          label="Access token"
          name="whatsapp_token"
          readOnly={isConnectionPending}
          placeholder="Enter token here"
          labelClassName="font-semibold text-sm leading-[100%] tracking-[-1%] text-black"
          fieldClassName="gap-2"
        />
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            className="min-w-30 rounded-md p-3 text-sm leading-[100%] font-medium tracking-[0%]"
            onClick={() => setWhatsappConnectDialog(false)}
            disabled={isConnectionPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={() => {}}
            disabled={isConnectionPending || !form.formState.isDirty}
            className="min-w-30 rounded-md [background-image:var(--gradient-primary)] p-3 text-sm leading-[100%] font-medium tracking-[0%]"
          >
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
};
