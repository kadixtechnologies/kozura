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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
    loginUrl: "http://localhost:3000/seller/settings"
  });

  // State for Cancelled
  const [cancelledProps, setCancelledProps] = useState({
    storeName: "My Awesome Store",
    loginUrl: "http://localhost:3000/seller/settings"
  });

  // State for Notification
  const [notificationProps, setNotificationProps] = useState({
    storeName: "My Awesome Store",
    ownerName: "Jane Doe",
    ownerEmail: "jane@example.com",
    loginUrl: "http://localhost:3000/admin"
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
        subtitle="Test and preview platform emails with dynamic data" 
      />
      <div className="p-7 space-y-6">
        <Tabs defaultValue="waitlist" value={activeTab} onValueChange={(val) => setActiveTab(val as TemplateKey)} className="w-full">
          <TabsList className="flex flex-wrap h-auto gap-2 mb-6 bg-transparent">
            <TabsTrigger value="waitlist" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-full px-4 py-2">Waitlist</TabsTrigger>
            <TabsTrigger value="upgrade" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-full px-4 py-2">Plan Upgrade</TabsTrigger>
            <TabsTrigger value="warning" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-full px-4 py-2">Payment Warning</TabsTrigger>
            <TabsTrigger value="cancelled" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-full px-4 py-2">Plan Cancelled</TabsTrigger>
            <TabsTrigger value="notification" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border rounded-full px-4 py-2">New Store</TabsTrigger>
          </TabsList>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Controls sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Dynamic Properties</CardTitle>
                  <CardDescription>Adjust the properties to see how the template renders.</CardDescription>
                </CardHeader>
                <CardContent>
                  {activeTab === 'waitlist' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Name</Label>
                        <Input 
                          value={waitlistProps.name} 
                          onChange={e => setWaitlistProps({...waitlistProps, name: e.target.value})} 
                        />
                      </div>
                    </div>
                  )}

                  {activeTab === 'upgrade' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Store Name</Label>
                        <Input value={upgradeProps.storeName} onChange={e => setUpgradeProps({...upgradeProps, storeName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Plan Name</Label>
                        <Input value={upgradeProps.planName} onChange={e => setUpgradeProps({...upgradeProps, planName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Amount</Label>
                        <Input value={upgradeProps.amount} onChange={e => setUpgradeProps({...upgradeProps, amount: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Next Billing Date</Label>
                        <Input value={upgradeProps.nextBillingDate} onChange={e => setUpgradeProps({...upgradeProps, nextBillingDate: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'warning' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Store Name</Label>
                        <Input value={warningProps.storeName} onChange={e => setWarningProps({...warningProps, storeName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Days Remaining</Label>
                        <Input type="number" value={warningProps.daysRemaining} onChange={e => setWarningProps({...warningProps, daysRemaining: parseInt(e.target.value) || 0})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Grace Period Ends</Label>
                        <Input value={warningProps.gracePeriodEnds} onChange={e => setWarningProps({...warningProps, gracePeriodEnds: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Login URL</Label>
                        <Input value={warningProps.loginUrl} onChange={e => setWarningProps({...warningProps, loginUrl: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'cancelled' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Store Name</Label>
                        <Input value={cancelledProps.storeName} onChange={e => setCancelledProps({...cancelledProps, storeName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Login URL</Label>
                        <Input value={cancelledProps.loginUrl} onChange={e => setCancelledProps({...cancelledProps, loginUrl: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {activeTab === 'notification' && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Store Name</Label>
                        <Input value={notificationProps.storeName} onChange={e => setNotificationProps({...notificationProps, storeName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Owner Name</Label>
                        <Input value={notificationProps.ownerName} onChange={e => setNotificationProps({...notificationProps, ownerName: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Owner Email</Label>
                        <Input value={notificationProps.ownerEmail} onChange={e => setNotificationProps({...notificationProps, ownerEmail: e.target.value})} />
                      </div>
                      <div className="space-y-2">
                        <Label>Login URL</Label>
                        <Input value={notificationProps.loginUrl} onChange={e => setNotificationProps({...notificationProps, loginUrl: e.target.value})} />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Preview pane */}
            <div className="lg:col-span-2">
              <Card className="h-[800px] flex flex-col">
                <CardHeader className="py-4 border-b bg-muted/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
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
