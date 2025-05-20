import { Link } from "wouter";
import { BookOpen, MapPin, Phone, Mail, Facebook, Twitter, Instagram } from "lucide-react";

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
                <Link href="/about" className="text-neutral-600 hover:text-primary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/hours" className="text-neutral-600 hover:text-primary">
                  Library Hours
                </Link>
              </li>
              <li>
                <Link href="/membership" className="text-neutral-600 hover:text-primary">
                  Membership
                </Link>
              </li>
              <li>
                <Link href="/policies" className="text-neutral-600 hover:text-primary">
                  Rules & Policies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-neutral-800 mb-4">Member Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/profile" className="text-neutral-600 hover:text-primary">
                  Your Account
                </Link>
              </li>
              <li>
                <Link href="/borrowed" className="text-neutral-600 hover:text-primary">
                  Borrowed Books
                </Link>
              </li>
              <li>
                <Link href="/history" className="text-neutral-600 hover:text-primary">
                  Reading History
                </Link>
              </li>
              <li>
                <Link href="/recommendations" className="text-neutral-600 hover:text-primary">
                  Book Recommendations
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
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm">&copy; 2023 LibraryHub. All rights reserved.</p>
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
