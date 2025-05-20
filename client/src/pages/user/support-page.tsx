import { useState } from "react";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const supportSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  subject: z.string().min(1, "Subject is required"),
  category: z.string().min(1, "Please select a category"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type SupportFormValues = z.infer<typeof supportSchema>;

export default function SupportPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SupportFormValues>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      category: "",
      message: ""
    }
  });
  
  const onSubmit = (data: SupportFormValues) => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      form.reset();
      toast({
        title: "Support request submitted",
        description: "We'll get back to you as soon as possible.",
      });
    }, 1000);
  };

  const faqs = [
    {
      question: "How long can I borrow a book?",
      answer: "Standard loan periods are 21 days for books. You can renew items up to 3 times if no one else has requested them."
    },
    {
      question: "How do I renew my borrowed books?",
      answer: "You can renew your books through your account dashboard. Go to 'My Borrowings', find the book you want to renew, and click on the 'Renew' button. Please note that books can only be renewed if they haven't been requested by another user."
    },
    {
      question: "What happens if I return a book late?",
      answer: "Late returns will incur a fine of $0.25 per day up to a maximum of the book's value. Your borrowing privileges may be suspended until all fines are paid."
    },
    {
      question: "Can I suggest a book for the library to purchase?",
      answer: "Yes! We welcome suggestions for new acquisitions. Please use the support form with the category 'Acquisition Request' to submit your suggestions."
    },
    {
      question: "How do I report a damaged book?",
      answer: "If you receive a damaged book or notice damage while using it, please report it immediately using the support form with the category 'Damaged Item'. This helps us maintain our collection quality."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-3xl font-bold mb-8">Support & Help Center</h1>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Frequently Asked Questions</CardTitle>
                  <CardDescription>
                    Find quick answers to common questions about our library services
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                        <AccordionContent>
                          {faq.answer}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Library Policies</CardTitle>
                  <CardDescription>
                    Important information about our library rules and policies
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium text-lg">Borrowing Policy</h3>
                    <p className="text-neutral-600">
                      Members may borrow up to 5 books at a time for a period of 21 days. Books can be renewed up to 3 times if they haven't been reserved by another user.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">Late Return Policy</h3>
                    <p className="text-neutral-600">
                      Late returns incur a fine of $0.25 per day up to a maximum of the book's value. Borrowing privileges will be suspended until all fines are paid.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="font-medium text-lg">Damaged or Lost Items</h3>
                    <p className="text-neutral-600">
                      Members are responsible for all materials checked out on their card. Charges for damaged or lost items will be the replacement cost plus a $5 processing fee.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Contact Support</CardTitle>
                  <CardDescription>
                    Need help with something specific? Send us a message
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input placeholder="Your email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Category</FormLabel>
                            <Select 
                              onValueChange={field.onChange} 
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="general">General Inquiry</SelectItem>
                                <SelectItem value="technical">Technical Issue</SelectItem>
                                <SelectItem value="account">Account Help</SelectItem>
                                <SelectItem value="damaged">Damaged Item</SelectItem>
                                <SelectItem value="suggestion">Suggestion</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Subject</FormLabel>
                            <FormControl>
                              <Input placeholder="Subject of your inquiry" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="How can we help you?" 
                                className="min-h-[120px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <Button 
                        type="submit" 
                        className="w-full bg-primary" 
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Request
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}