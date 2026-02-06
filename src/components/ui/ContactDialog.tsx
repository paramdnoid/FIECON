"use client";

import {
  useState,
  useEffect,
  useRef,
  forwardRef,
  type FormEvent,
} from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
import { CONTACT, COMPANY } from "@/lib/constants";
import { useFocusTrap } from "@/hooks/useFocusTrap";

type Props = {
  open: boolean;
  onClose: () => void;
};

type FormState = "idle" | "sending" | "success" | "error";

type FieldErrors = {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
};

const ease = [0.16, 1, 0.3, 1] as [number, number, number, number];

export function ContactDialog({ open, onClose }: Props) {
  const t = useTranslations("contact.dialog");
  const tContact = useTranslations("contact");
  const prefersReduced = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const trapRef = useFocusTrap(open);
  const firstInputRef = useRef<HTMLInputElement>(null);

  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // Focus first input on open
  useEffect(() => {
    if (open) {
      const timer = setTimeout(() => firstInputRef.current?.focus(), 150);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Escape to close
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  function validate(): FieldErrors {
    const errs: FieldErrors = {};
    if (!form.name.trim()) errs.name = t("required");
    if (!form.email.trim()) {
      errs.email = t("required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errs.email = t("invalid_email");
    }
    if (!form.subject.trim()) errs.subject = t("required");
    if (!form.message.trim()) errs.message = t("required");
    return errs;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setFormState("sending");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Request failed");

      setFormState("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setFormState("error");
    }
  }

  function handleClose() {
    onClose();
    setTimeout(() => {
      setFormState("idle");
      setErrors({});
    }, 300);
  }

  const motionProps = prefersReduced
    ? {}
    : {
        initial: { opacity: 0, scale: 0.96, y: 24 },
        animate: { opacity: 1, scale: 1, y: 0 },
        exit: { opacity: 0, scale: 0.96, y: 24 },
        transition: { duration: 0.4, ease },
      };

  const backdropMotion = prefersReduced
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.3 },
      };

  return (
    <AnimatePresence>
      {open && (
        <div ref={trapRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            {...backdropMotion}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
            aria-hidden="true"
          />

          {/* Dialog */}
          <motion.div
            {...motionProps}
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={t("title")}
            className="relative w-full max-w-4xl max-h-[90vh] overflow-hidden bg-white rounded-2xl shadow-2xl shadow-bordeaux-900/25 flex flex-col lg:flex-row"
          >
            {/* Left panel — branding & contact info */}
            <div className="hidden lg:flex lg:w-[380px] flex-col justify-between text-white p-10 relative overflow-hidden" style={{ backgroundColor: '#62191C' }}>
              {/* Decorative circles with logo watermark */}
              <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full bg-bordeaux-700/20 flex items-center justify-center">
                <svg
                  viewBox="0 0 1536 1536"
                  className="w-40 h-40 -translate-x-4 -translate-y-4 opacity-[0.08]"
                  fill="white"
                >
                  <path d="M 1085.00,758.00 L 1079.00,756.00 L 1063.00,755.00 L 1062.00,754.00 L 1050.00,754.00 L 1049.00,753.00 L 996.00,753.00 L 995.00,754.00 L 985.00,754.00 L 984.00,755.00 L 967.00,756.00 L 966.00,757.00 L 949.00,759.00 L 909.00,768.00 L 868.00,781.00 L 865.00,783.00 L 847.00,789.00 L 835.00,795.00 L 830.00,796.00 L 750.00,835.00 L 748.00,837.00 L 673.00,875.00 L 671.00,875.00 L 640.00,890.00 L 607.00,903.00 L 559.00,918.00 L 555.00,918.00 L 542.00,922.00 L 517.00,927.00 L 511.00,927.00 L 510.00,928.00 L 490.00,930.00 L 489.00,931.00 L 481.00,931.00 L 480.00,932.00 L 470.00,932.00 L 469.00,933.00 L 428.00,934.00 L 427.00,935.00 L 418.00,935.00 L 417.00,936.00 L 421.00,938.00 L 431.00,939.00 L 437.00,941.00 L 467.00,944.00 L 468.00,945.00 L 483.00,945.00 L 484.00,946.00 L 537.00,945.00 L 538.00,944.00 L 568.00,941.00 L 579.00,938.00 L 584.00,938.00 L 593.00,935.00 L 597.00,935.00 L 623.00,928.00 L 653.00,917.00 L 655.00,919.00 L 653.00,990.00 L 652.00,991.00 L 652.00,1002.00 L 651.00,1003.00 L 650.00,1018.00 L 644.00,1039.00 L 637.00,1048.00 L 629.00,1052.00 L 611.00,1054.00 L 610.00,1055.00 L 594.00,1055.00 L 591.00,1056.00 L 588.00,1059.00 L 588.00,1065.00 L 590.00,1067.00 L 595.00,1069.00 L 649.00,1069.00 L 650.00,1068.00 L 681.00,1068.00 L 682.00,1067.00 L 727.00,1067.00 L 728.00,1068.00 L 764.00,1068.00 L 765.00,1069.00 L 834.00,1069.00 L 838.00,1068.00 L 842.00,1064.00 L 842.00,1059.00 L 839.00,1056.00 L 805.00,1054.00 L 804.00,1053.00 L 795.00,1053.00 L 794.00,1052.00 L 784.00,1051.00 L 778.00,1049.00 L 772.00,1045.00 L 768.00,1041.00 L 763.00,1032.00 L 758.00,1008.00 L 757.00,981.00 L 756.00,980.00 L 756.00,960.00 L 755.00,959.00 L 755.00,871.00 L 856.00,819.00 L 858.00,819.00 L 897.00,801.00 L 929.00,790.00 L 932.00,788.00 L 965.00,778.00 L 998.00,770.00 L 1003.00,770.00 L 1008.00,768.00 L 1038.00,764.00 L 1039.00,763.00 L 1084.00,759.00 Z" />
                  <path d="M 1264.00,687.00 L 1262.00,683.00 L 1253.00,682.00 L 1247.00,680.00 L 1240.00,680.00 L 1239.00,681.00 L 1242.00,707.00 L 1243.00,708.00 L 1243.00,716.00 L 1244.00,717.00 L 1245.00,740.00 L 1246.00,741.00 L 1246.00,794.00 L 1245.00,795.00 L 1244.00,818.00 L 1243.00,819.00 L 1243.00,827.00 L 1242.00,828.00 L 1240.00,848.00 L 1228.00,900.00 L 1216.00,936.00 L 1204.00,965.00 L 1177.00,1016.00 L 1157.00,1046.00 L 1123.00,1088.00 L 1088.00,1123.00 L 1062.00,1145.00 L 1019.00,1175.00 L 995.00,1189.00 L 967.00,1203.00 L 941.00,1214.00 L 896.00,1229.00 L 852.00,1239.00 L 827.00,1242.00 L 826.00,1243.00 L 792.00,1245.00 L 791.00,1246.00 L 729.00,1245.00 L 728.00,1244.00 L 717.00,1244.00 L 716.00,1243.00 L 709.00,1243.00 L 708.00,1242.00 L 682.00,1239.00 L 677.00,1237.00 L 667.00,1236.00 L 639.00,1229.00 L 602.00,1217.00 L 566.00,1202.00 L 516.00,1175.00 L 472.00,1144.00 L 447.00,1123.00 L 413.00,1089.00 L 391.00,1063.00 L 360.00,1019.00 L 345.00,993.00 L 333.00,969.00 L 321.00,941.00 L 314.00,919.00 L 312.00,916.00 L 300.00,871.00 L 288.00,869.00 L 279.00,866.00 L 276.00,866.00 L 275.00,870.00 L 287.00,917.00 L 305.00,966.00 L 325.00,1007.00 L 347.00,1044.00 L 374.00,1081.00 L 399.00,1110.00 L 425.00,1136.00 L 443.00,1152.00 L 478.00,1179.00 L 526.00,1209.00 L 567.00,1229.00 L 618.00,1248.00 L 664.00,1260.00 L 669.00,1260.00 L 699.00,1266.00 L 727.00,1268.00 L 728.00,1269.00 L 741.00,1269.00 L 742.00,1270.00 L 793.00,1270.00 L 794.00,1269.00 L 828.00,1267.00 L 829.00,1266.00 L 836.00,1266.00 L 837.00,1265.00 L 855.00,1263.00 L 900.00,1253.00 L 946.00,1238.00 L 977.00,1225.00 L 1005.00,1211.00 L 1039.00,1191.00 L 1077.00,1164.00 L 1112.00,1134.00 L 1144.00,1101.00 L 1176.00,1061.00 L 1202.00,1021.00 L 1224.00,979.00 L 1245.00,926.00 L 1245.00,923.00 L 1249.00,913.00 L 1254.00,892.00 L 1256.00,888.00 L 1266.00,835.00 L 1268.00,807.00 L 1269.00,806.00 L 1269.00,790.00 L 1270.00,789.00 L 1270.00,746.00 L 1269.00,745.00 L 1269.00,729.00 L 1268.00,728.00 L 1268.00,718.00 L 1267.00,717.00 Z" />
                  <path d="M 1454.00,726.00 L 1408.00,698.00 L 1361.00,674.00 L 1331.00,661.00 L 1302.00,651.00 L 1299.00,649.00 L 1256.00,636.00 L 1252.00,636.00 L 1225.00,629.00 L 1220.00,629.00 L 1209.00,626.00 L 1203.00,626.00 L 1189.00,623.00 L 1182.00,623.00 L 1181.00,622.00 L 1145.00,620.00 L 1144.00,619.00 L 1089.00,619.00 L 1088.00,620.00 L 1062.00,621.00 L 1061.00,622.00 L 1054.00,622.00 L 1053.00,623.00 L 1046.00,623.00 L 1045.00,624.00 L 1038.00,624.00 L 1037.00,625.00 L 1013.00,628.00 L 967.00,638.00 L 963.00,640.00 L 931.00,648.00 L 867.00,670.00 L 803.00,696.00 L 757.00,717.00 L 755.00,715.00 L 755.00,519.00 L 759.00,515.00 L 798.00,515.00 L 799.00,516.00 L 888.00,517.00 L 889.00,518.00 L 897.00,518.00 L 906.00,520.00 L 922.00,527.00 L 934.00,538.00 L 939.00,551.00 L 940.00,574.00 L 942.00,581.00 L 944.00,583.00 L 951.00,583.00 L 954.00,581.00 L 956.00,576.00 L 957.00,556.00 L 958.00,555.00 L 958.00,540.00 L 959.00,539.00 L 960.00,505.00 L 966.00,478.00 L 966.00,469.00 L 963.00,466.00 L 957.00,466.00 L 950.00,470.00 L 942.00,472.00 L 917.00,473.00 L 916.00,474.00 L 677.00,474.00 L 676.00,473.00 L 635.00,473.00 L 634.00,472.00 L 584.00,472.00 L 578.00,474.00 L 575.00,478.00 L 575.00,481.00 L 578.00,485.00 L 581.00,486.00 L 611.00,487.00 L 629.00,491.00 L 637.00,495.00 L 644.00,501.00 L 649.00,509.00 L 652.00,519.00 L 653.00,535.00 L 654.00,536.00 L 654.00,589.00 L 655.00,590.00 L 655.00,761.00 L 653.00,763.00 L 641.00,767.00 L 626.00,774.00 L 621.00,775.00 L 616.00,778.00 L 572.00,793.00 L 569.00,795.00 L 566.00,795.00 L 530.00,807.00 L 526.00,807.00 L 519.00,810.00 L 515.00,810.00 L 507.00,813.00 L 503.00,813.00 L 489.00,817.00 L 463.00,821.00 L 462.00,822.00 L 450.00,823.00 L 449.00,824.00 L 413.00,827.00 L 412.00,828.00 L 355.00,829.00 L 354.00,828.00 L 336.00,828.00 L 335.00,827.00 L 324.00,827.00 L 323.00,826.00 L 298.00,824.00 L 263.00,817.00 L 258.00,817.00 L 232.00,810.00 L 228.00,810.00 L 221.00,807.00 L 200.00,802.00 L 194.00,799.00 L 191.00,799.00 L 156.00,787.00 L 128.00,775.00 L 123.00,774.00 L 81.00,755.00 L 79.00,757.00 L 114.00,780.00 L 156.00,804.00 L 158.00,804.00 L 176.00,814.00 L 178.00,814.00 L 205.00,827.00 L 251.00,844.00 L 254.00,844.00 L 264.00,848.00 L 282.00,852.00 L 290.00,855.00 L 343.00,865.00 L 373.00,867.00 L 374.00,868.00 L 387.00,868.00 L 388.00,869.00 L 432.00,869.00 L 433.00,868.00 L 449.00,868.00 L 450.00,867.00 L 479.00,865.00 L 480.00,864.00 L 511.00,860.00 L 536.00,854.00 L 540.00,854.00 L 549.00,851.00 L 553.00,851.00 L 557.00,849.00 L 592.00,840.00 L 631.00,827.00 L 686.00,806.00 L 691.00,803.00 L 703.00,799.00 L 710.00,795.00 L 740.00,783.00 L 783.00,763.00 L 792.00,760.00 L 810.00,751.00 L 826.00,745.00 L 835.00,740.00 L 924.00,704.00 L 992.00,682.00 L 1024.00,674.00 L 1033.00,673.00 L 1043.00,670.00 L 1048.00,670.00 L 1053.00,668.00 L 1065.00,667.00 L 1071.00,665.00 L 1103.00,662.00 L 1104.00,661.00 L 1115.00,661.00 L 1116.00,660.00 L 1133.00,660.00 L 1134.00,659.00 L 1181.00,659.00 L 1182.00,660.00 L 1220.00,662.00 L 1221.00,663.00 L 1256.00,667.00 L 1287.00,673.00 L 1296.00,676.00 L 1300.00,676.00 L 1348.00,689.00 L 1401.00,707.00 L 1446.00,725.00 L 1451.00,728.00 L 1453.00,728.00 Z" />
                  <path d="M 1247.00,616.00 L 1231.00,572.00 L 1211.00,530.00 L 1191.00,496.00 L 1164.00,458.00 L 1134.00,423.00 L 1100.00,390.00 L 1061.00,359.00 L 1031.00,339.00 L 1005.00,324.00 L 979.00,311.00 L 951.00,299.00 L 900.00,282.00 L 896.00,282.00 L 880.00,277.00 L 855.00,272.00 L 837.00,270.00 L 836.00,269.00 L 829.00,269.00 L 828.00,268.00 L 794.00,266.00 L 793.00,265.00 L 741.00,265.00 L 740.00,266.00 L 707.00,268.00 L 706.00,269.00 L 699.00,269.00 L 692.00,271.00 L 680.00,272.00 L 655.00,277.00 L 650.00,279.00 L 646.00,279.00 L 639.00,282.00 L 635.00,282.00 L 597.00,294.00 L 558.00,310.00 L 512.00,334.00 L 478.00,356.00 L 443.00,383.00 L 425.00,399.00 L 399.00,425.00 L 374.00,454.00 L 347.00,491.00 L 325.00,528.00 L 305.00,569.00 L 287.00,618.00 L 275.00,664.00 L 275.00,669.00 L 270.00,692.00 L 269.00,706.00 L 268.00,707.00 L 266.00,741.00 L 265.00,742.00 L 265.00,793.00 L 266.00,794.00 L 266.00,803.00 L 270.00,805.00 L 280.00,807.00 L 286.00,807.00 L 287.00,808.00 L 290.00,807.00 L 289.00,744.00 L 290.00,743.00 L 290.00,730.00 L 291.00,729.00 L 291.00,717.00 L 292.00,716.00 L 293.00,701.00 L 303.00,650.00 L 312.00,622.00 L 312.00,619.00 L 314.00,616.00 L 321.00,594.00 L 332.00,568.00 L 345.00,542.00 L 360.00,516.00 L 381.00,485.00 L 399.00,462.00 L 413.00,446.00 L 447.00,412.00 L 477.00,387.00 L 516.00,360.00 L 544.00,344.00 L 589.00,323.00 L 632.00,308.00 L 672.00,298.00 L 677.00,298.00 L 702.00,293.00 L 708.00,293.00 L 709.00,292.00 L 727.00,291.00 L 728.00,290.00 L 743.00,290.00 L 744.00,289.00 L 790.00,289.00 L 791.00,290.00 L 805.00,290.00 L 806.00,291.00 L 817.00,291.00 L 818.00,292.00 L 840.00,294.00 L 881.00,302.00 L 910.00,311.00 L 913.00,311.00 L 916.00,313.00 L 919.00,313.00 L 958.00,328.00 L 995.00,346.00 L 1027.00,365.00 L 1058.00,387.00 L 1078.00,403.00 L 1111.00,434.00 L 1131.00,456.00 L 1148.00,477.00 L 1177.00,519.00 L 1204.00,570.00 L 1204.00,572.00 L 1211.00,586.00 L 1212.00,591.00 L 1215.00,596.00 L 1221.00,614.00 L 1243.00,619.00 L 1246.00,619.00 Z" />
                </svg>
              </div>
              <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-white/5" />

              <div className="relative z-10 space-y-6">
                <div className="w-10 h-1 bg-beige-400 rounded-full" />
                <div>
                  <h2 className="font-display text-4xl font-light leading-tight mb-3">
                    {t("title")}
                  </h2>
                  <p className="text-beige-200/70 text-sm leading-relaxed">
                    {t("panel_subtitle")}
                  </p>
                </div>
              </div>

              <div className="relative z-10 space-y-6 text-sm">
                <div>
                  <p className="text-beige-400/50 text-xs font-medium tracking-[0.2em] uppercase mb-1.5">
                    {tContact("email")}
                  </p>
                  <p className="text-beige-100 break-all">{CONTACT.email}</p>
                </div>
                <div>
                  <p className="text-beige-400/50 text-xs font-medium tracking-[0.2em] uppercase mb-1.5">
                    {tContact("phone")}
                  </p>
                  <p className="text-beige-100">{CONTACT.phone}</p>
                </div>
                <div>
                  <p className="text-beige-400/50 text-xs font-medium tracking-[0.2em] uppercase mb-1.5">
                    {tContact("address")}
                  </p>
                  <p className="text-beige-100 leading-relaxed">
                    {CONTACT.address.street}
                    <br />
                    {CONTACT.address.zip} {CONTACT.address.city}
                  </p>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <div className="w-2 h-2 rotate-45 bg-beige-400/30" />
                  <p className="text-beige-400/30 text-xs">
                    {COMPANY.fullName}
                  </p>
                </div>
              </div>
            </div>

            {/* Right panel — form */}
            <div className="flex-1 overflow-y-auto max-h-[90vh]">
              {/* Header */}
              <div className="flex items-center justify-between p-6 lg:p-8 lg:hidden">
                <h2 className="font-display text-2xl sm:text-3xl font-light text-text-primary">
                  {t("title")}
                </h2>
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center w-10 h-10 rounded-full text-text-muted hover:text-text-primary hover:bg-beige-100 transition-colors cursor-pointer"
                  aria-label={t("close")}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M4 4l10 10M14 4L4 14" />
                  </svg>
                </button>
              </div>

              {/* Close button for desktop */}
              <div className="hidden lg:flex justify-end p-6 pb-0">
                <button
                  onClick={handleClose}
                  className="flex items-center justify-center w-10 h-10 rounded-full text-text-muted hover:text-text-primary hover:bg-beige-100 transition-colors cursor-pointer"
                  aria-label={t("close")}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 18 18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M4 4l10 10M14 4L4 14" />
                  </svg>
                </button>
              </div>

              {/* Content */}
              <div className="p-6 lg:p-8 lg:pt-4">
                {formState === "success" ? (
                  <SuccessView t={t} onClose={handleClose} />
                ) : formState === "error" ? (
                  <ErrorView t={t} onRetry={() => setFormState("idle")} />
                ) : (
                  <form onSubmit={handleSubmit} noValidate className="space-y-5">
                    {/* Name + Email row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <Field
                        label={t("name")}
                        placeholder={t("name_placeholder")}
                        value={form.name}
                        error={errors.name}
                        ref={firstInputRef}
                        onChange={(v) =>
                          setForm((f) => ({ ...f, name: v }))
                        }
                      />
                      <Field
                        label={t("email")}
                        type="email"
                        placeholder={t("email_placeholder")}
                        value={form.email}
                        error={errors.email}
                        onChange={(v) =>
                          setForm((f) => ({ ...f, email: v }))
                        }
                      />
                    </div>

                    <Field
                      label={t("subject")}
                      placeholder={t("subject_placeholder")}
                      value={form.subject}
                      error={errors.subject}
                      onChange={(v) =>
                        setForm((f) => ({ ...f, subject: v }))
                      }
                    />

                    <TextareaField
                      label={t("message")}
                      placeholder={t("message_placeholder")}
                      value={form.message}
                      error={errors.message}
                      onChange={(v) =>
                        setForm((f) => ({ ...f, message: v }))
                      }
                    />

                    <button
                      type="submit"
                      disabled={formState === "sending"}
                      className="w-full inline-flex items-center justify-center gap-2.5 px-8 py-3.5 text-base font-medium rounded-xl bg-bordeaux-900 text-white hover:bg-bordeaux-700 shadow-lg shadow-bordeaux-900/15 hover:shadow-xl hover:shadow-bordeaux-900/20 transition-all duration-400 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {formState === "sending" ? (
                        <>
                          <Spinner />
                          {t("sending")}
                        </>
                      ) : (
                        <>
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 2L11 13" />
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" />
                          </svg>
                          {t("submit")}
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

/* ---------- Sub-components ---------- */

type FieldProps = {
  label: string;
  placeholder: string;
  value: string;
  error?: string;
  type?: string;
  onChange: (value: string) => void;
};

const Field = forwardRef<HTMLInputElement, FieldProps>(
  ({ label, placeholder, value, error, type = "text", onChange }, ref) => (
    <div>
      <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-text-muted mb-2">
        {label}
      </label>
      <input
        ref={ref}
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-lg bg-beige-50 border text-text-primary placeholder:text-text-muted/40 outline-none transition-all duration-200 focus:bg-white focus:border-bordeaux-700 focus:ring-2 focus:ring-bordeaux-700/10 ${
          error ? "border-red-300 bg-red-50/30" : "border-beige-200"
        }`}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  ),
);
Field.displayName = "Field";

function TextareaField({
  label,
  placeholder,
  value,
  error,
  onChange,
}: FieldProps) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-text-muted mb-2">
        {label}
      </label>
      <textarea
        value={value}
        placeholder={placeholder}
        rows={5}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-4 py-3 rounded-lg bg-beige-50 border text-text-primary placeholder:text-text-muted/40 outline-none transition-all duration-200 resize-none focus:bg-white focus:border-bordeaux-700 focus:ring-2 focus:ring-bordeaux-700/10 ${
          error ? "border-red-300 bg-red-50/30" : "border-beige-200"
        }`}
      />
      {error && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
      )}
    </div>
  );
}

function SuccessView({
  t,
  onClose,
}: {
  t: (key: string) => string;
  onClose: () => void;
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-20 h-20 rounded-full bg-bordeaux-900/5 flex items-center justify-center mb-8">
        <div className="w-14 h-14 rounded-full bg-bordeaux-900/10 flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#62191C"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
      </div>
      <h3 className="font-display text-3xl font-light text-text-primary mb-3">
        {t("success_title")}
      </h3>
      <p className="text-text-muted max-w-xs mx-auto mb-10 leading-relaxed">
        {t("success_text")}
      </p>
      <button
        onClick={onClose}
        className="px-8 py-3 rounded-xl border border-bordeaux-900 text-bordeaux-900 hover:bg-bordeaux-900 hover:text-white transition-all duration-400 font-medium cursor-pointer"
      >
        {t("close")}
      </button>
    </div>
  );
}

function ErrorView({
  t,
  onRetry,
}: {
  t: (key: string) => string;
  onRetry: () => void;
}) {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mb-8">
        <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#dc2626"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        </div>
      </div>
      <h3 className="font-display text-3xl font-light text-text-primary mb-3">
        {t("error_title")}
      </h3>
      <p className="text-text-muted max-w-xs mx-auto mb-10 leading-relaxed">
        {t("error_text")}
      </p>
      <button
        onClick={onRetry}
        className="px-8 py-3 rounded-xl bg-bordeaux-900 text-white hover:bg-bordeaux-700 transition-all duration-400 font-medium cursor-pointer"
      >
        {t("retry")}
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}
