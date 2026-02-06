"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { TextReveal } from "@/components/animations/TextReveal";
import { SlideReveal } from "@/components/animations/SlideReveal";
import { MagneticButton } from "@/components/animations/MagneticButton";

const LOGO_PATHS = [
  "M 1085.00,758.00 L 1079.00,756.00 L 1063.00,755.00 L 1062.00,754.00 L 1050.00,754.00 L 1049.00,753.00 L 996.00,753.00 L 995.00,754.00 L 985.00,754.00 L 984.00,755.00 L 967.00,756.00 L 966.00,757.00 L 949.00,759.00 L 909.00,768.00 L 868.00,781.00 L 865.00,783.00 L 847.00,789.00 L 835.00,795.00 L 830.00,796.00 L 750.00,835.00 L 748.00,837.00 L 673.00,875.00 L 671.00,875.00 L 640.00,890.00 L 607.00,903.00 L 559.00,918.00 L 555.00,918.00 L 542.00,922.00 L 517.00,927.00 L 511.00,927.00 L 510.00,928.00 L 490.00,930.00 L 489.00,931.00 L 481.00,931.00 L 480.00,932.00 L 470.00,932.00 L 469.00,933.00 L 428.00,934.00 L 427.00,935.00 L 418.00,935.00 L 417.00,936.00 L 421.00,938.00 L 431.00,939.00 L 437.00,941.00 L 467.00,944.00 L 468.00,945.00 L 483.00,945.00 L 484.00,946.00 L 537.00,945.00 L 538.00,944.00 L 568.00,941.00 L 579.00,938.00 L 584.00,938.00 L 593.00,935.00 L 597.00,935.00 L 623.00,928.00 L 653.00,917.00 L 655.00,919.00 L 653.00,990.00 L 652.00,991.00 L 652.00,1002.00 L 651.00,1003.00 L 650.00,1018.00 L 644.00,1039.00 L 637.00,1048.00 L 629.00,1052.00 L 611.00,1054.00 L 610.00,1055.00 L 594.00,1055.00 L 591.00,1056.00 L 588.00,1059.00 L 588.00,1065.00 L 590.00,1067.00 L 595.00,1069.00 L 649.00,1069.00 L 650.00,1068.00 L 681.00,1068.00 L 682.00,1067.00 L 727.00,1067.00 L 728.00,1068.00 L 764.00,1068.00 L 765.00,1069.00 L 834.00,1069.00 L 838.00,1068.00 L 842.00,1064.00 L 842.00,1059.00 L 839.00,1056.00 L 805.00,1054.00 L 804.00,1053.00 L 795.00,1053.00 L 794.00,1052.00 L 784.00,1051.00 L 778.00,1049.00 L 772.00,1045.00 L 768.00,1041.00 L 763.00,1032.00 L 758.00,1008.00 L 757.00,981.00 L 756.00,980.00 L 756.00,960.00 L 755.00,959.00 L 755.00,871.00 L 856.00,819.00 L 858.00,819.00 L 897.00,801.00 L 929.00,790.00 L 932.00,788.00 L 965.00,778.00 L 998.00,770.00 L 1003.00,770.00 L 1008.00,768.00 L 1038.00,764.00 L 1039.00,763.00 L 1084.00,759.00 Z",
  "M 1264.00,687.00 L 1262.00,683.00 L 1253.00,682.00 L 1247.00,680.00 L 1240.00,680.00 L 1239.00,681.00 L 1242.00,707.00 L 1243.00,708.00 L 1243.00,716.00 L 1244.00,717.00 L 1245.00,740.00 L 1246.00,741.00 L 1246.00,794.00 L 1245.00,795.00 L 1244.00,818.00 L 1243.00,819.00 L 1243.00,827.00 L 1242.00,828.00 L 1240.00,848.00 L 1228.00,900.00 L 1216.00,936.00 L 1204.00,965.00 L 1177.00,1016.00 L 1157.00,1046.00 L 1123.00,1088.00 L 1088.00,1123.00 L 1062.00,1145.00 L 1019.00,1175.00 L 995.00,1189.00 L 967.00,1203.00 L 941.00,1214.00 L 896.00,1229.00 L 852.00,1239.00 L 827.00,1242.00 L 826.00,1243.00 L 792.00,1245.00 L 791.00,1246.00 L 729.00,1245.00 L 728.00,1244.00 L 717.00,1244.00 L 716.00,1243.00 L 709.00,1243.00 L 708.00,1242.00 L 682.00,1239.00 L 677.00,1237.00 L 667.00,1236.00 L 639.00,1229.00 L 602.00,1217.00 L 566.00,1202.00 L 516.00,1175.00 L 472.00,1144.00 L 447.00,1123.00 L 413.00,1089.00 L 391.00,1063.00 L 360.00,1019.00 L 345.00,993.00 L 333.00,969.00 L 321.00,941.00 L 314.00,919.00 L 312.00,916.00 L 300.00,871.00 L 288.00,869.00 L 279.00,866.00 L 276.00,866.00 L 275.00,870.00 L 287.00,917.00 L 305.00,966.00 L 325.00,1007.00 L 347.00,1044.00 L 374.00,1081.00 L 399.00,1110.00 L 425.00,1136.00 L 443.00,1152.00 L 478.00,1179.00 L 526.00,1209.00 L 567.00,1229.00 L 618.00,1248.00 L 664.00,1260.00 L 669.00,1260.00 L 699.00,1266.00 L 727.00,1268.00 L 728.00,1269.00 L 741.00,1269.00 L 742.00,1270.00 L 793.00,1270.00 L 794.00,1269.00 L 828.00,1267.00 L 829.00,1266.00 L 836.00,1266.00 L 837.00,1265.00 L 855.00,1263.00 L 900.00,1253.00 L 946.00,1238.00 L 977.00,1225.00 L 1005.00,1211.00 L 1039.00,1191.00 L 1077.00,1164.00 L 1112.00,1134.00 L 1144.00,1101.00 L 1176.00,1061.00 L 1202.00,1021.00 L 1224.00,979.00 L 1245.00,926.00 L 1245.00,923.00 L 1249.00,913.00 L 1254.00,892.00 L 1256.00,888.00 L 1266.00,835.00 L 1268.00,807.00 L 1269.00,806.00 L 1269.00,790.00 L 1270.00,789.00 L 1270.00,746.00 L 1269.00,745.00 L 1269.00,729.00 L 1268.00,728.00 L 1268.00,718.00 L 1267.00,717.00 Z",
  "M 1454.00,726.00 L 1408.00,698.00 L 1361.00,674.00 L 1331.00,661.00 L 1302.00,651.00 L 1299.00,649.00 L 1256.00,636.00 L 1252.00,636.00 L 1225.00,629.00 L 1220.00,629.00 L 1209.00,626.00 L 1203.00,626.00 L 1189.00,623.00 L 1182.00,623.00 L 1181.00,622.00 L 1145.00,620.00 L 1144.00,619.00 L 1089.00,619.00 L 1088.00,620.00 L 1062.00,621.00 L 1061.00,622.00 L 1054.00,622.00 L 1053.00,623.00 L 1046.00,623.00 L 1045.00,624.00 L 1038.00,624.00 L 1037.00,625.00 L 1013.00,628.00 L 967.00,638.00 L 963.00,640.00 L 931.00,648.00 L 867.00,670.00 L 803.00,696.00 L 757.00,717.00 L 755.00,715.00 L 755.00,519.00 L 759.00,515.00 L 798.00,515.00 L 799.00,516.00 L 888.00,517.00 L 889.00,518.00 L 897.00,518.00 L 906.00,520.00 L 922.00,527.00 L 934.00,538.00 L 939.00,551.00 L 940.00,574.00 L 942.00,581.00 L 944.00,583.00 L 951.00,583.00 L 954.00,581.00 L 956.00,576.00 L 957.00,556.00 L 958.00,555.00 L 958.00,540.00 L 959.00,539.00 L 960.00,505.00 L 966.00,478.00 L 966.00,469.00 L 963.00,466.00 L 957.00,466.00 L 950.00,470.00 L 942.00,472.00 L 917.00,473.00 L 916.00,474.00 L 677.00,474.00 L 676.00,473.00 L 635.00,473.00 L 634.00,472.00 L 584.00,472.00 L 578.00,474.00 L 575.00,478.00 L 575.00,481.00 L 578.00,485.00 L 581.00,486.00 L 611.00,487.00 L 629.00,491.00 L 637.00,495.00 L 644.00,501.00 L 649.00,509.00 L 652.00,519.00 L 653.00,535.00 L 654.00,536.00 L 654.00,589.00 L 655.00,590.00 L 655.00,761.00 L 653.00,763.00 L 641.00,767.00 L 626.00,774.00 L 621.00,775.00 L 616.00,778.00 L 572.00,793.00 L 569.00,795.00 L 566.00,795.00 L 530.00,807.00 L 526.00,807.00 L 519.00,810.00 L 515.00,810.00 L 507.00,813.00 L 503.00,813.00 L 489.00,817.00 L 463.00,821.00 L 462.00,822.00 L 450.00,823.00 L 449.00,824.00 L 413.00,827.00 L 412.00,828.00 L 355.00,829.00 L 354.00,828.00 L 336.00,828.00 L 335.00,827.00 L 324.00,827.00 L 323.00,826.00 L 298.00,824.00 L 263.00,817.00 L 258.00,817.00 L 232.00,810.00 L 228.00,810.00 L 221.00,807.00 L 200.00,802.00 L 194.00,799.00 L 191.00,799.00 L 156.00,787.00 L 128.00,775.00 L 123.00,774.00 L 81.00,755.00 L 79.00,757.00 L 114.00,780.00 L 156.00,804.00 L 158.00,804.00 L 176.00,814.00 L 178.00,814.00 L 205.00,827.00 L 251.00,844.00 L 254.00,844.00 L 264.00,848.00 L 282.00,852.00 L 290.00,855.00 L 343.00,865.00 L 373.00,867.00 L 374.00,868.00 L 387.00,868.00 L 388.00,869.00 L 432.00,869.00 L 433.00,868.00 L 449.00,868.00 L 450.00,867.00 L 479.00,865.00 L 480.00,864.00 L 511.00,860.00 L 536.00,854.00 L 540.00,854.00 L 549.00,851.00 L 553.00,851.00 L 557.00,849.00 L 592.00,840.00 L 631.00,827.00 L 686.00,806.00 L 691.00,803.00 L 703.00,799.00 L 710.00,795.00 L 740.00,783.00 L 783.00,763.00 L 792.00,760.00 L 810.00,751.00 L 826.00,745.00 L 835.00,740.00 L 924.00,704.00 L 992.00,682.00 L 1024.00,674.00 L 1033.00,673.00 L 1043.00,670.00 L 1048.00,670.00 L 1053.00,668.00 L 1065.00,667.00 L 1071.00,665.00 L 1103.00,662.00 L 1104.00,661.00 L 1115.00,661.00 L 1116.00,660.00 L 1133.00,660.00 L 1134.00,659.00 L 1181.00,659.00 L 1182.00,660.00 L 1220.00,662.00 L 1221.00,663.00 L 1256.00,667.00 L 1287.00,673.00 L 1296.00,676.00 L 1300.00,676.00 L 1348.00,689.00 L 1401.00,707.00 L 1446.00,725.00 L 1451.00,728.00 L 1453.00,728.00 Z",
  "M 1247.00,616.00 L 1231.00,572.00 L 1211.00,530.00 L 1191.00,496.00 L 1164.00,458.00 L 1134.00,423.00 L 1100.00,390.00 L 1061.00,359.00 L 1031.00,339.00 L 1005.00,324.00 L 979.00,311.00 L 951.00,299.00 L 900.00,282.00 L 896.00,282.00 L 880.00,277.00 L 855.00,272.00 L 837.00,270.00 L 836.00,269.00 L 829.00,269.00 L 828.00,268.00 L 794.00,266.00 L 793.00,265.00 L 741.00,265.00 L 740.00,266.00 L 707.00,268.00 L 706.00,269.00 L 699.00,269.00 L 692.00,271.00 L 680.00,272.00 L 655.00,277.00 L 650.00,279.00 L 646.00,279.00 L 639.00,282.00 L 635.00,282.00 L 597.00,294.00 L 558.00,310.00 L 512.00,334.00 L 478.00,356.00 L 443.00,383.00 L 425.00,399.00 L 399.00,425.00 L 374.00,454.00 L 347.00,491.00 L 325.00,528.00 L 305.00,569.00 L 287.00,618.00 L 275.00,664.00 L 275.00,669.00 L 270.00,692.00 L 269.00,706.00 L 268.00,707.00 L 266.00,741.00 L 265.00,742.00 L 265.00,793.00 L 266.00,794.00 L 266.00,803.00 L 270.00,805.00 L 280.00,807.00 L 286.00,807.00 L 287.00,808.00 L 290.00,807.00 L 289.00,744.00 L 290.00,743.00 L 290.00,730.00 L 291.00,729.00 L 291.00,717.00 L 292.00,716.00 L 293.00,701.00 L 303.00,650.00 L 312.00,622.00 L 312.00,619.00 L 314.00,616.00 L 321.00,594.00 L 332.00,568.00 L 345.00,542.00 L 360.00,516.00 L 381.00,485.00 L 399.00,462.00 L 413.00,446.00 L 447.00,412.00 L 477.00,387.00 L 516.00,360.00 L 544.00,344.00 L 589.00,323.00 L 632.00,308.00 L 672.00,298.00 L 677.00,298.00 L 702.00,293.00 L 708.00,293.00 L 709.00,292.00 L 727.00,291.00 L 728.00,290.00 L 743.00,290.00 L 744.00,289.00 L 790.00,289.00 L 791.00,290.00 L 805.00,290.00 L 806.00,291.00 L 817.00,291.00 L 818.00,292.00 L 840.00,294.00 L 881.00,302.00 L 910.00,311.00 L 913.00,311.00 L 916.00,313.00 L 919.00,313.00 L 958.00,328.00 L 995.00,346.00 L 1027.00,365.00 L 1058.00,387.00 L 1078.00,403.00 L 1111.00,434.00 L 1131.00,456.00 L 1148.00,477.00 L 1177.00,519.00 L 1204.00,570.00 L 1204.00,572.00 L 1211.00,586.00 L 1212.00,591.00 L 1215.00,596.00 L 1221.00,614.00 L 1243.00,619.00 L 1246.00,619.00 Z",
];

export function Hero() {
  const t = useTranslations("hero");
  const prefersReduced = useReducedMotion();
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const logoY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const logoScale = useTransform(scrollYProgress, [0, 1], [1, 1.05]);

  return (
    <section ref={heroRef} className="relative min-h-svh flex items-center overflow-hidden">
      {/* Background decorative layers */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Layer 1: Radial spotlight gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(224,207,194,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Layer 2: Beige blob top-right (existing) */}
        <div className="absolute -top-32 -right-32 w-150 h-150 bg-beige-200/20 rounded-full blur-3xl" />

        {/* Layer 3: Bordeaux blob bottom-left (new) */}
        <div className="absolute -bottom-48 -left-40 w-[30rem] h-[30rem] bg-bordeaux-500/[0.06] rounded-full blur-3xl" />

        {/* Layer 4: Logo watermark */}
        <motion.svg
          viewBox="0 0 1536 1536"
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] sm:w-[50rem] sm:h-[50rem] lg:w-[60rem] lg:h-[60rem]"
          style={!prefersReduced ? { y: logoY, scale: logoScale } : undefined}
          {...(!prefersReduced && {
            initial: { opacity: 0, scale: 0.95 },
            animate: { opacity: 1, scale: 1 },
            transition: {
              duration: 2.5,
              delay: 0.3,
              ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
            },
          })}
        >
          <g fill="#62191C" fillOpacity={0.03} stroke="none">
            {LOGO_PATHS.map((d, i) => (
              <path key={i} d={d} />
            ))}
          </g>
        </motion.svg>

        {/* Layer 5: Diagonal accent lines */}
        <motion.div
          className="absolute top-[15%] left-[10%] w-px h-32 bg-linear-to-b from-bordeaux-900/[0.06] to-transparent origin-top rotate-[25deg]"
          {...(!prefersReduced && {
            initial: { scaleY: 0, opacity: 0 },
            animate: { scaleY: 1, opacity: 1 },
            transition: { duration: 1.8, delay: 1.0, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
          })}
        />
        <motion.div
          className="absolute bottom-[20%] right-[12%] w-px h-24 bg-linear-to-t from-accent/[0.08] to-transparent origin-bottom -rotate-[20deg]"
          {...(!prefersReduced && {
            initial: { scaleY: 0, opacity: 0 },
            animate: { scaleY: 1, opacity: 1 },
            transition: { duration: 1.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
          })}
        />

        {/* Layer 6: Vertical line (enhanced) */}
        <motion.div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-px bg-linear-to-b from-accent/15 via-accent/5 to-transparent"
          {...(!prefersReduced && {
            initial: { height: 0 },
            animate: { height: "35%" },
            transition: { duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
          })}
        />

        {/* Layer 7: Diamond at line terminus */}
        <motion.div
          className="absolute top-[35%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rotate-45 bg-accent/20"
          {...(!prefersReduced && {
            initial: { opacity: 0, scale: 0 },
            animate: { opacity: 1, scale: 1 },
            transition: { duration: 0.4, delay: 2.0, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
          })}
        />

        {/* Layer 8: Floating ambient dots */}
        <motion.div
          className="absolute top-[30%] left-[8%] w-1 h-1 rounded-full bg-accent/20"
          {...(!prefersReduced && {
            animate: {
              y: [0, -15, 0],
              opacity: [0.15, 0.3, 0.15],
            },
            transition: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            },
          })}
        />
        <motion.div
          className="absolute top-[55%] right-[15%] w-1.5 h-1.5 rounded-full bg-bordeaux-900/10"
          {...(!prefersReduced && {
            animate: {
              y: [0, 12, 0],
              opacity: [0.1, 0.2, 0.1],
            },
            transition: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2.0,
            },
          })}
        />
      </div>

      <Container size="lg" className="relative z-10 pt-32 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tagline with decorative lines */}
          <motion.div
            {...(!prefersReduced && {
              initial: { opacity: 0 },
              whileInView: { opacity: 1 },
              viewport: { once: true },
              transition: { duration: 0.8, delay: 0.2 },
            })}
            className="flex items-center justify-center gap-4 mb-8"
          >
            <div className="w-8 h-px bg-linear-to-r from-transparent to-accent" />
            <p className="text-sm font-medium tracking-[0.4em] uppercase text-accent">
              {t("tagline")}
            </p>
            <div className="w-8 h-px bg-linear-to-l from-transparent to-accent" />
          </motion.div>

          {/* Main heading with TextReveal */}
          <div className="mb-6">
            <TextReveal
              as="h1"
              delay={0.3}
              staggerDelay={0.1}
              className="font-display font-light tracking-tight text-8xl sm:text-9xl lg:text-[11rem] gradient-text-hero leading-none"
            >
              FIECON
            </TextReveal>
          </div>

          {/* Headline */}
          <SlideReveal direction="bottom" delay={0.6} className="mb-6">
            <p className="font-display text-2xl sm:text-3xl lg:text-4xl text-text-primary font-normal tracking-tight text-balance">
              {t("headline")}
            </p>
          </SlideReveal>

          {/* Subtitle */}
          <motion.p
            {...(!prefersReduced && {
              initial: { opacity: 0, y: 15 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
            })}
            className="text-lg sm:text-xl text-text-muted max-w-2xl mx-auto leading-relaxed mb-12 text-balance"
          >
            {t("subtitle")}
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...(!prefersReduced && {
              initial: { opacity: 0, y: 15 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true },
              transition: { duration: 0.6, delay: 1.0 },
            })}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <MagneticButton>
              <Button variant="primary" size="lg" href="#services">
                {t("cta_primary")}
              </Button>
            </MagneticButton>
            <MagneticButton>
              <Button variant="secondary" size="lg" href="#contact">
                {t("cta_secondary")}
              </Button>
            </MagneticButton>
          </motion.div>
        </div>
      </Container>

      {/* Scroll indicator */}
      <motion.div
        {...(!prefersReduced && {
          initial: { opacity: 0 },
          whileInView: { opacity: 1 },
          viewport: { once: true },
          transition: { duration: 0.6, delay: 1.4 },
        })}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          {...(!prefersReduced && {
            animate: { y: [0, 4, 0], opacity: [0.3, 0.7, 0.3] },
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          })}
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
}
