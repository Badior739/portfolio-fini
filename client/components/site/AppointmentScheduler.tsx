import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, Mail, MessageSquare, CheckCircle, ChevronLeft, ChevronRight, Loader2, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { API_BASE_URL } from "@/config";

interface TimeSlot {
  time: string;
  available: boolean;
}

const timeSlots: TimeSlot[] = [
  { time: "09:00", available: true },
  { time: "10:00", available: true },
  { time: "11:00", available: true },
  { time: "14:00", available: true },
  { time: "15:00", available: true },
  { time: "16:00", available: true },
  { time: "17:00", available: true },
];

export function AppointmentScheduler() {
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    topic: ""
  });
  const [loading, setLoading] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const handleDateSelect = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    // Prevent past dates
    if (date < new Date(new Date().setHours(0,0,0,0))) return;
    // Prevent weekends (0 = Sunday, 6 = Saturday)
    if (date.getDay() === 0 || date.getDay() === 6) return;
    
    setSelectedDate(date);
    setSelectedTime(null); // Reset time when date changes
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handlePrevMonth = () => {
    const today = new Date();
    const prevMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    if (prevMonth.getMonth() < today.getMonth() && prevMonth.getFullYear() === today.getFullYear()) return;
    setCurrentMonth(prevMonth);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime || !formData.name || !formData.email || !formData.topic) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/appointment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          date: selectedDate.toISOString(),
          time: selectedTime
        })
      });

      if (res.ok) {
        setStep(4);
        toast({
          title: t('appointment.scheduler.toast.confirmed'),
          description: t('appointment.scheduler.toast.confirmedDesc'),
        });
      } else {
        throw new Error("Failed to schedule");
      }
    } catch (error) {
      toast({
        title: t('appointment.scheduler.toast.error'),
        description: t('appointment.scheduler.toast.errorDesc'),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Generate localized week days starting from Sunday
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2023, 0, i + 1); // Jan 1 2023 was Sunday
    return new Intl.DateTimeFormat(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'short' }).format(date);
  });

  return (
    <div className="w-full max-w-4xl mx-auto bg-card/30 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
      <div className="grid md:grid-cols-[1fr_2fr] min-h-[500px]">
        {/* Sidebar Info */}
        <div className="bg-primary/5 p-8 flex flex-col justify-between border-r border-white/5">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">{t('appointment.scheduler.title')}</h3>
            <p className="text-muted-foreground mb-8">{t('appointment.scheduler.description')}</p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-sm text-white/80">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <span>{t('appointment.scheduler.duration')}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                  <Video className="w-4 h-4" />
                </div>
                <span>{t('appointment.scheduler.platform')}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex gap-2 mb-2">
              {[1, 2, 3].map((s) => (
                <div 
                  key={s} 
                  className={cn(
                    "h-1 flex-1 rounded-full transition-colors duration-300",
                    step >= (s === 3 && step === 4 ? 3 : s) ? "bg-primary" : "bg-white/10"
                  )} 
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">{t('appointment.scheduler.step')} {step === 4 ? 3 : step} {t('appointment.scheduler.of')} 3</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8 relative">
            {/* Step 1: Date & Time */}
            {step === 1 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h4 className="text-lg font-medium text-white">{t('appointment.scheduler.chooseDate')}</h4>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={handlePrevMonth} disabled={currentMonth <= new Date()}>
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="font-medium text-white min-w-[100px] text-center capitalize">
                      {currentMonth.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <Button variant="ghost" size="icon" onClick={handleNextMonth}>
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-6 text-center">
                  {weekDays.map(d => (
                    <span key={d} className="text-xs font-medium text-muted-foreground py-2 capitalize">{d}</span>
                  ))}
                  {Array.from({ length: firstDayOfMonth(currentMonth) }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth(currentMonth) }).map((_, i) => {
                    const day = i + 1;
                    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                    const isToday = new Date().toDateString() === date.toDateString();
                    const isSelected = selectedDate?.toDateString() === date.toDateString();
                    const isPast = date < new Date(new Date().setHours(0,0,0,0));
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                    const isDisabled = isPast || isWeekend;

                    return (
                      <button
                        key={day}
                        onClick={() => handleDateSelect(day)}
                        disabled={isDisabled}
                        className={cn(
                          "aspect-square rounded-full flex items-center justify-center text-sm transition-all relative group",
                          isSelected ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25" : "hover:bg-white/5 text-white",
                          isToday && !isSelected && "border border-primary text-primary",
                          isDisabled && "opacity-20 cursor-not-allowed hover:bg-transparent"
                        )}
                      >
                        {day}
                        {!isDisabled && !isSelected && (
                          <div className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {selectedDate && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-3"
                  >
                    <h5 className="text-sm font-medium text-muted-foreground">{t('appointment.scheduler.availableSlots')} {selectedDate.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US')}</h5>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          className={cn(
                            "text-xs",
                            selectedTime === slot.time ? "bg-primary hover:bg-primary/90" : "bg-transparent border-white/10 hover:bg-white/5"
                          )}
                          onClick={() => setSelectedTime(slot.time)}
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  </motion.div>
                )}

                <div className="flex justify-end mt-8">
                  <Button 
                    onClick={() => setStep(2)} 
                    disabled={!selectedDate || !selectedTime}
                    className="bg-white text-black hover:bg-white/90"
                  >
                    {t('appointment.scheduler.next')} <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Details */}
            {step === 2 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <h4 className="text-lg font-medium text-white mb-6">{t('appointment.scheduler.detailsTitle')}</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">{t('appointment.scheduler.nameLabel')}</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input 
                        placeholder={t('appointment.scheduler.namePlaceholder')}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">{t('appointment.scheduler.emailLabel')}</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Input 
                        type="email" 
                        placeholder={t('appointment.scheduler.emailPlaceholder')}
                        className="pl-10 bg-white/5 border-white/10 text-white"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm text-muted-foreground">{t('appointment.scheduler.topicLabel')}</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                      <Textarea 
                        placeholder={t('appointment.scheduler.topicPlaceholder')}
                        className="pl-10 min-h-[100px] bg-white/5 border-white/10 text-white resize-none"
                        value={formData.topic}
                        onChange={(e) => setFormData({...formData, topic: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-8 pt-4 border-t border-white/5">
                    <Button variant="ghost" onClick={() => setStep(1)} className="text-white hover:bg-white/5">
                      <ChevronLeft className="w-4 h-4 mr-2" /> {t('appointment.scheduler.back')}
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={loading || !formData.name || !formData.email || !formData.topic}
                      className="bg-primary hover:bg-primary/90 text-white"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : t('appointment.scheduler.confirm')}
                    </Button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Step 3: Success */}
            {step === 4 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center h-full text-center py-12"
              >
                <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 text-green-500">
                  <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t('appointment.scheduler.successTitle')}</h3>
                <p className="text-muted-foreground max-w-md mb-8">
                  {t('appointment.scheduler.successMessage')
                    .replace('{date}', selectedDate?.toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US') || '')
                    .replace('{time}', selectedTime || '')}
                </p>
                <Button onClick={() => window.location.reload()} variant="outline" className="border-white/10 text-white hover:bg-white/5">
                  {t('appointment.scheduler.returnHome')}
                </Button>
              </motion.div>
            )}
        </div>
      </div>
    </div>
  );
}
