"use client";

import { useState, useMemo } from "react";
import { AdminLayout, AdminTopBar } from "@/components/admin/AdminSidebar";
import { renderToStaticMarkup } from "react-dom/server";

// Import all templates
import { WaitlistConfirmationEmail } from "@/lib/email/templates/waitlist-confirmation";
import { SubscriptionUpgradeEmail } from "@/lib/email/templates/subscription-upgrade";
import { PaymentFailedWarningEmail } from "@/lib/email/templates/payment-failed-warning";
import { SubscriptionCancelledEmail } from "@/lib/email/templates/subscription-cancelled";
import { NewStoreNotificationEmail } from "@/lib/email/templates/new-store-notification";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

type TemplateKey = 'waitlist' | 'upgrade' | 'warning' | 'cancelled' | 'notification';

export function ClientEmailPreviewPage() {
  const [activeTab, setActiveTab] = useState<TemplateKey>('waitlist');

  // State for Waitlist
  const [waitlistProps, setWaitlistProps] = useState({ name: "Jane Doe" });

  // State for Upgrade
  const [upgradeProps, setUpgradeProps] = useState({
    storeName: "My Awesome Store",
    planName: "Pro Plan",
    amount: "5,000",
    nextBillingDate: new Date().toISOString()
  });

  // State for Warning
  const [warningProps, setWarningProps] = useState({
    storeName: "My Awesome Store",
    daysRemaining: 7,
    gracePeriodEnds: new Date(Date.now() + 7 * 86400000).toLocaleDateString(),
    loginUrl: "https://www.kozura.ng/seller/settings"
  });

  // State for Cancelled
  const [cancelledProps, setCancelledProps] = useState({
    storeName: "My Awesome Store",
    loginUrl: "https://www.kozura.ng/seller/settings"
  });

  // State for Notification
  const [notificationProps, setNotificationProps] = useState({
    storeName: "My Awesome Store",
    ownerName: "Jane Doe",
    ownerEmail: "jane@example.com",
    loginUrl: "https://www.kozura.ng/hq"
  });

  const getTemplateHtml = () => {
    switch (activeTab) {
      case 'waitlist':
        return renderToStaticMarkup(<WaitlistConfirmationEmail {...waitlistProps} />);
      case 'upgrade':
        return renderToStaticMarkup(<SubscriptionUpgradeEmail {...upgradeProps} />);
      case 'warning':
        return renderToStaticMarkup(<PaymentFailedWarningEmail {...warningProps} />);
      case 'cancelled':
        return renderToStaticMarkup(<SubscriptionCancelledEmail {...cancelledProps} />);
      case 'notification':
        return renderToStaticMarkup(<NewStoreNotificationEmail {...notificationProps} />);
      default:
        return "";
    }
  };

  const htmlContent = useMemo(() => getTemplateHtml(), [activeTab, waitlistProps, upgradeProps, warningProps, cancelledProps, notificationProps]);

  return (
    <AdminLayout>
      <AdminTopBar
        title="Email Templates Preview"
        subtitle="Preview emails with dynamic data"
      />
      <div className="p-4 sm:p-7 space-y-4 sm:space-y-6">
        <Tabs defaultValue="waitlist" value={activeTab} onValueChange={(val) => setActiveTab(val as TemplateKey)} className="w-full">
          <div className="mb-5 w-full sm:w-64">
            <Select value={activeTab} onValueChange={(val) => setActiveTab(val as TemplateKey)}>
              <SelectTrigger className="w-full rounded-xl bg-background h-10 px-3 text-[13px] sm:text-sm font-medium shadow-sm border-border/60">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/60">
                <SelectItem value="waitlist" className="text-[13px] sm:text-sm rounded-lg cursor-pointer">Waitlist</SelectItem>
                <SelectItem value="upgrade" className="text-[13px] sm:text-sm rounded-lg cursor-pointer">Plan Upgrade</SelectItem>
                <SelectItem value="warning" className="text-[13px] sm:text-sm rounded-lg cursor-pointer">Payment Warning</SelectItem>
                <SelectItem value="cancelled" className="text-[13px] sm:text-sm rounded-lg cursor-pointer">Plan Cancelled</SelectItem>
                <SelectItem value="notification" className="text-[13px] sm:text-sm rounded-lg cursor-pointer">New Store</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            {/* Controls sidebar */}
            <div className="lg:col-span-1 space-y-4 sm:space-y-6">
              <Card className="rounded-[20px] sm:rounded-[24px]">
                <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                  <CardTitle className="text-sm sm:text-base">Dynamic Properties</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Adjust the properties to see how the template renders.</CardDescription>
                </CardHeader>
                <CardContent className="p-4 sm:p-6 pt-0 sm:pt-0">
                  {activeTab === 'waitlist' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[11px] sm:text-xs">Name</Label>
                        <Input className="h-8 sm:h-10 text-[13px] sm:text-sm rounded-xl"
                          value={waitlistProps.name}
                          onChange={e => setWaitlistProps({ ...waitlistProps, name: e.target.value })}
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'upgrade' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[11px] sm:text-xs">Store Name</Label>
                        <Input className="h-8 sm:h-10 text-[13px] sm:text-sm rounded-xl" value={upgradeProps.storeName} onChange={e => setUpgradeProps({ ...upgradeProps, storeName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] sm:text-xs">Plan Name</Label>
                        <Input className="h-8 sm:h-10 text-[13px] sm:text-sm rounded-xl" value={upgradeProps.planName} onChange={e => setUpgradeProps({ ...upgradeProps, planName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] sm:text-xs">Amount</Label>
                        <Input className="h-8 sm:h-10 text-[13px] sm:text-sm rounded-xl" value={upgradeProps.amount} onChange={e => setUpgradeProps({ ...upgradeProps, amount: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] sm:text-xs">Next Billing Date</Label>
                        <Input className="h-8 sm:h-10 text-[13px] sm:text-sm rounded-xl" value={upgradeProps.nextBillingDate} onChange={e => setUpgradeProps({ ...upgradeProps, nextBillingDate: e.target.value })} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'warning' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[11px] sm:text-xs">Store Name</Label>
                        <Input className="h-8 sm:h-10 text-[13px] sm:text-sm rounded-xl" value={warningProps.storeName} onChange={e => setWarningProps({ ...warningProps, storeName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] sm:text-xs">Days Remaining</Label>
                        <Input className="h-8 sm:h-10 text-[13px] sm:text-sm rounded-xl" type="number" value={warningProps.daysRemaining} onChange={e => setWarningProps({ ...warningProps, daysRemaining: parseInt(e.target.value) || 0 })} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] sm:text-xs">Grace Period Ends</Label>
                        <Input className="h-8 sm:h-10 text-[13px] sm:text-sm rounded-xl" value={warningProps.gracePeriodEnds} onChange={e => setWarningProps({ ...warningProps, gracePeriodEnds: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] sm:text-xs">Login URL</Label>
                        <Input className="h-8 sm:h-10 text-[13px] sm:text-sm rounded-xl" value={warningProps.loginUrl} onChange={e => setWarningProps({ ...warningProps, loginUrl: e.target.value })} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'cancelled' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[11px] sm:text-xs">Store Name</Label>
                        <Input className="h-8 sm:h-10 text-[13px] sm:text-sm rounded-xl" value={cancelledProps.storeName} onChange={e => setCancelledProps({ ...cancelledProps, storeName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] sm:text-xs">Login URL</Label>
                        <Input className="h-8 sm:h-10 text-[13px] sm:text-sm rounded-xl" value={cancelledProps.loginUrl} onChange={e => setCancelledProps({ ...cancelledProps, loginUrl: e.target.value })} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'notification' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label className="text-[11px] sm:text-xs">Store Name</Label>
                        <Input className="h-8 sm:h-10 text-[13px] sm:text-sm rounded-xl" value={notificationProps.storeName} onChange={e => setNotificationProps({ ...notificationProps, storeName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] sm:text-xs">Owner Name</Label>
                        <Input className="h-8 sm:h-10 text-[13px] sm:text-sm rounded-xl" value={notificationProps.ownerName} onChange={e => setNotificationProps({ ...notificationProps, ownerName: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] sm:text-xs">Owner Email</Label>
                        <Input className="h-8 sm:h-10 text-[13px] sm:text-sm rounded-xl" value={notificationProps.ownerEmail} onChange={e => setNotificationProps({ ...notificationProps, ownerEmail: e.target.value })} />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[11px] sm:text-xs">Login URL</Label>
                        <Input className="h-8 sm:h-10 text-[13px] sm:text-sm rounded-xl" value={notificationProps.loginUrl} onChange={e => setNotificationProps({ ...notificationProps, loginUrl: e.target.value })} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Preview pane */}
            <div className="lg:col-span-2">
              <Card className="h-[600px] sm:h-[800px] flex flex-col rounded-[20px] sm:rounded-[24px] overflow-hidden">
                <CardHeader className="py-3 sm:py-4 border-b bg-muted/50 px-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full bg-red-400"></div>
                      <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                      <div className="h-3 w-3 rounded-full bg-green-400"></div>
                      <span className="ml-2 text-muted-foreground">Inbox Preview</span>
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden bg-white">
                  <iframe
                    srcDoc={htmlContent}
                    className="w-full h-full border-none"
                    title="Email Preview"
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
