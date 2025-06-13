
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Book, Send, LogOut, User, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
  books?: any[];
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("readroom_current_user");
    if (!user) {
      navigate("/login");
      return;
    }
    
    const userData = JSON.parse(user);
    setCurrentUser(userData);

    // Load chat history
    const chatHistory = localStorage.getItem(`readroom_chat_${userData.id}`);
    if (chatHistory) {
      setMessages(JSON.parse(chatHistory));
    } else {
      // Welcome message
      const welcomeMessage: Message = {
        id: "welcome",
        text: `Hi ${userData.name}! 💕 I'm your friendly book bot. Tell me about your mood, favorite genres, or authors, and I'll recommend some amazing books for you! Try saying something like "I want a happy romance book" or "Suggest some fantasy novels" ✨`,
        isBot: true,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, [navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Save chat history whenever messages change
    if (currentUser && messages.length > 0) {
      localStorage.setItem(`readroom_chat_${currentUser.id}`, JSON.stringify(messages));
    }
  }, [messages, currentUser]);

  const handleLogout = () => {
    localStorage.removeItem("readroom_current_user");
    toast({
      title: "Goodbye! 👋",
      description: "Thanks for chatting about books with me!"
    });
    navigate("/");
  };

  const detectIntent = (text: string) => {
    const lowercaseText = text.toLowerCase();
    
    // Mood detection
    const moods = {
      happy: ["happy", "cheerful", "uplifting", "joyful", "funny", "comedy", "light"],
      sad: ["sad", "emotional", "cry", "tearjerker", "melancholy", "depressing"],
      romantic: ["romance", "romantic", "love", "dating", "relationship"],
      adventurous: ["adventure", "action", "exciting", "thrilling", "quest"],
      mysterious: ["mystery", "suspense", "thriller", "detective", "crime"],
      fantasy: ["fantasy", "magic", "dragons", "wizards", "supernatural"],
      scifi: ["sci-fi", "science fiction", "space", "future", "technology"]
    };

    // Genre detection
    const genres = {
      fantasy: ["fantasy", "magic", "dragons", "wizards", "supernatural", "paranormal"],
      romance: ["romance", "romantic", "love story", "dating"],
      mystery: ["mystery", "detective", "crime", "thriller", "suspense"],
      scifi: ["sci-fi", "science fiction", "space", "future", "dystopian"],
      horror: ["horror", "scary", "ghost", "vampire", "zombie"],
      historical: ["historical", "history", "period", "war", "vintage"],
      literary: ["literary", "classic", "literature", "philosophical"],
      ya: ["young adult", "ya", "teen", "teenager", "coming of age"],
      contemporary: ["contemporary", "modern", "realistic", "slice of life"]
    };

    let detectedMood = null;
    let detectedGenre = null;

    for (const [mood, keywords] of Object.entries(moods)) {
      if (keywords.some(keyword => lowercaseText.includes(keyword))) {
        detectedMood = mood;
        break;
      }
    }

    for (const [genre, keywords] of Object.entries(genres)) {
      if (keywords.some(keyword => lowercaseText.includes(keyword))) {
        detectedGenre = genre;
        break;
      }
    }

    return { mood: detectedMood, genre: detectedGenre };
  };

  const getFallbackBooks = (mood?: string, genre?: string) => {
    const bookDatabase = {
      happy: [
        { title: "Beach Read", author: "Emily Henry", genre: "Contemporary Romance" },
        { title: "The House in the Cerulean Sea", author: "TJ Klune", genre: "Fantasy Romance" },
        { title: "Anxious People", author: "Fredrik Backman", genre: "Literary Fiction" }
      ],
      romantic: [
        { title: "The Seven Husbands of Evelyn Hugo", author: "Taylor Jenkins Reid", genre: "Historical Fiction" },
        { title: "It Ends with Us", author: "Colleen Hoover", genre: "Contemporary Romance" },
        { title: "The Song of Achilles", author: "Madeline Miller", genre: "Historical Fiction" }
      ],
      fantasy: [
        { title: "Fourth Wing", author: "Rebecca Yarros", genre: "Fantasy Romance" },
        { title: "The Priory of the Orange Tree", author: "Samantha Shannon", genre: "Epic Fantasy" },
        { title: "The Invisible Life of Addie LaRue", author: "V.E. Schwab", genre: "Fantasy" }
      ],
      mystery: [
        { title: "The Thursday Murder Club", author: "Richard Osman", genre: "Cozy Mystery" },
        { title: "The Silent Patient", author: "Alex Michaelides", genre: "Psychological Thriller" },
        { title: "Gone Girl", author: "Gillian Flynn", genre: "Psychological Thriller" }
      ],
      default: [
        { title: "Atomic Habits", author: "James Clear", genre: "Self-Help" },
        { title: "Where the Crawdads Sing", author: "Delia Owens", genre: "Literary Fiction" },
        { title: "The Midnight Library", author: "Matt Haig", genre: "Literary Fiction" },
        { title: "Educated", author: "Tara Westover", genre: "Memoir" }
      ]
    };

    if (mood && bookDatabase[mood as keyof typeof bookDatabase]) {
      return bookDatabase[mood as keyof typeof bookDatabase];
    }
    if (genre && bookDatabase[genre as keyof typeof bookDatabase]) {
      return bookDatabase[genre as keyof typeof bookDatabase];
    }
    return bookDatabase.default;
  };

  const generateBotResponse = async (userMessage: string) => {
    const { mood, genre } = detectIntent(userMessage);
    
    // Get fallback books (in a real app, you'd also try API calls here)
    const books = getFallbackBooks(mood, genre);
    
    let responseText = "";
    
    if (mood && genre) {
      responseText = `I love that you're looking for ${mood} ${genre} books! Here are some perfect recommendations for you:`;
    } else if (mood) {
      responseText = `Perfect! I have some wonderful ${mood} books that will match your mood beautifully:`;
    } else if (genre) {
      responseText = `Excellent choice! ${genre.charAt(0).toUpperCase() + genre.slice(1)} is such a fantastic genre. Here are my top picks:`;
    } else {
      responseText = "I'd love to help you find the perfect book! Here are some popular recommendations that readers absolutely adore:";
    }

    return {
      text: responseText,
      books: books.slice(0, 3) // Return up to 3 books
    };
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText("");
    setIsTyping(true);

    // Simulate bot thinking time
    setTimeout(async () => {
      const botResponse = await generateBotResponse(inputText);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse.text,
        isBot: true,
        timestamp: new Date(),
        books: botResponse.books
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-peach-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-pink-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Book className="text-pink-500 w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold text-pink-600 font-serif">ReadRoom</h1>
            <p className="text-sm text-gray-600">Your personal book companion</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-pink-100 text-pink-600">
                {currentUser.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="text-gray-700 font-medium">{currentUser.name}</span>
          </div>
          <Button
            onClick={handleLogout}
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-800 hover:bg-pink-50"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 pb-24">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-4 ${message.isBot ? "" : "justify-end"}`}>
              {message.isBot && (
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-400 text-white">
                    <Book className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-2xl ${message.isBot ? "" : "flex flex-col items-end"}`}>
                <Card className={`p-4 ${
                  message.isBot 
                    ? "bg-white border-pink-100 shadow-sm" 
                    : "bg-gradient-to-r from-pink-500 to-rose-500 text-white border-0"
                }`}>
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  
                  {message.books && message.books.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {message.books.map((book, index) => (
                        <div key={index} className="bg-pink-50 rounded-lg p-3 border border-pink-100">
                          <div className="flex items-start gap-3">
                            <div className="w-12 h-16 bg-gradient-to-br from-pink-200 to-purple-200 rounded flex items-center justify-center flex-shrink-0">
                              <Book className="w-6 h-6 text-pink-600" />
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-800 text-sm">{book.title}</h4>
                              <p className="text-gray-600 text-xs mt-1">by {book.author}</p>
                              <span className="inline-block bg-pink-100 text-pink-700 text-xs px-2 py-1 rounded-full mt-2">
                                {book.genre}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
                
                <p className="text-xs text-gray-500 mt-1 px-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              {!message.isBot && (
                <Avatar className="w-10 h-10 flex-shrink-0">
                  <AvatarFallback className="bg-pink-100 text-pink-600">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          
          {isTyping && (
            <div className="flex gap-4">
              <Avatar className="w-10 h-10 flex-shrink-0">
                <AvatarFallback className="bg-gradient-to-r from-pink-400 to-purple-400 text-white">
                  <Book className="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <Card className="bg-white border-pink-100 shadow-sm p-4 max-w-xs">
                <div className="flex items-center gap-2 text-gray-600">
                  <Sparkles className="w-4 h-4 animate-pulse text-pink-500" />
                  <span className="text-sm">ReadRoom is thinking...</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                    <div className="w-1 h-1 bg-pink-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  </div>
                </div>
              </Card>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur border-t border-pink-100 p-6">
        <div className="max-w-4xl mx-auto flex gap-3">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about books based on your mood, genre, or favorite authors... 📚"
            className="flex-1 border-pink-200 focus:border-pink-400 focus:ring-pink-400 rounded-full px-6 py-3"
            disabled={isTyping}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isTyping}
            className="bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-full px-6 py-3"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
