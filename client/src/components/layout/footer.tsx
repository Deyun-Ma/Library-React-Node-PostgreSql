import { Link } from "wouter";
import { 
  BookOpen, 
  MapPin, 
  Phone, 
  Mail, 
  Facebook, 
  Twitter, 
  Instagram, 
  Clock, 
  FileText, 
  HelpCircle, 
  Calendar, 
  BookMarked, 
  User, 
  Bell, 
  Heart, 
  BookOpenCheck
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-neutral-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <BookOpen className="h-6 w-6 text-primary mr-2" />
              <h2 className="font-medium text-lg text-primary">LibraryHub</h2>
            </div>
            <p className="text-neutral-600 text-sm">
              Your gateway to knowledge and imagination. Explore our vast collection of books for education, entertainment, and enlightenment.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-neutral-800 mb-4">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="flex items-center text-neutral-600 hover:text-primary">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>About Our Library</span>
                </Link>
              </li>
              <li>
                <Link href="/hours" className="flex items-center text-neutral-600 hover:text-primary">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Operating Hours</span>
                </Link>
              </li>
              <li>
                <Link href="/membership" className="flex items-center text-neutral-600 hover:text-primary">
                  <BookMarked className="h-4 w-4 mr-2" />
                  <span>Membership Benefits</span>
                </Link>
              </li>
              <li>
                <Link href="/policies" className="flex items-center text-neutral-600 hover:text-primary">
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Rules & Policies</span>
                </Link>
              </li>
              <li>
                <Link href="/events" className="flex items-center text-neutral-600 hover:text-primary">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Events Calendar</span>
                </Link>
              </li>
              <li>
                <Link href="/faq" className="flex items-center text-neutral-600 hover:text-primary">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span>FAQ</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-neutral-800 mb-4">Member Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/profile" className="flex items-center text-neutral-600 hover:text-primary">
                  <User className="h-4 w-4 mr-2" />
                  <span>Your Profile</span>
                </Link>
              </li>
              <li>
                <Link href="/borrowed" className="flex items-center text-neutral-600 hover:text-primary">
                  <BookOpenCheck className="h-4 w-4 mr-2" />
                  <span>Borrowed Books</span>
                </Link>
              </li>
              <li>
                <Link href="/history" className="flex items-center text-neutral-600 hover:text-primary">
                  <BookOpen className="h-4 w-4 mr-2" />
                  <span>Reading History</span>
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="flex items-center text-neutral-600 hover:text-primary">
                  <Heart className="h-4 w-4 mr-2" />
                  <span>Book Recommendations</span>
                </Link>
              </li>
              <li>
                <Link href="/notifications" className="flex items-center text-neutral-600 hover:text-primary">
                  <Bell className="h-4 w-4 mr-2" />
                  <span>Notifications</span>
                </Link>
              </li>
              <li>
                <Link href="/help" className="flex items-center text-neutral-600 hover:text-primary">
                  <HelpCircle className="h-4 w-4 mr-2" />
                  <span>Help Center</span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-neutral-800 mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center text-neutral-600">
                <MapPin className="h-4 w-4 mr-2" />
                123 Library Street, Booktown
              </li>
              <li className="flex items-center text-neutral-600">
                <Phone className="h-4 w-4 mr-2" />
                (555) 123-4567
              </li>
              <li className="flex items-center text-neutral-600">
                <Mail className="h-4 w-4 mr-2" />
                info@libraryhub.com
              </li>
              <li className="mt-4">
                <Link href="/contact" className="inline-block bg-primary text-white text-sm px-3 py-2 rounded hover:bg-primary-dark transition-colors">
                  Send a Message
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-neutral-500 text-sm flex flex-col md:flex-row md:space-x-4">
            <p>&copy; {new Date().getFullYear()} LibraryHub. All rights reserved.</p>
            <div className="flex space-x-4 mt-2 md:mt-0">
              <Link href="/privacy" className="hover:text-primary">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-primary">Terms of Use</Link>
            </div>
          </div>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-neutral-500 hover:text-neutral-800">
              <Facebook className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-500 hover:text-neutral-800">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-neutral-500 hover:text-neutral-800">
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
