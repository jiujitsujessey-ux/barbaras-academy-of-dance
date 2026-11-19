/* ============================================================
   STUDIO CALENDAR — HOW TO UPDATE (for studio staff)
   ------------------------------------------------------------
   Each line between the [ ] below is one calendar entry:

   { month: "September", when: "Mon · Sept 8", title: "Classes begin!",
     type: "milestone", note: "" },

   - month: which month heading it appears under (in order below)
   - when:  the date text exactly as you want it shown
   - title: the event name
   - type:  one of  "milestone" | "closed" | "tickets" | "due" |
            "performance" | "event"   (controls the color chip)
   - note:  optional smaller line under the title ("" for none)

   Keep entries in the order they should appear. Save the file,
   then run the usual site update to publish.
   ============================================================ */
export const SEASON = "2026/27";
export const EVENTS = [
  { month: "August", when: "Wed \u00b7 Aug 12", title: "Open House", type: "event", note: "Try a class \u00b7 tour the studio \u00b7 refreshments" },
  { month: "September", when: "Mon \u00b7 Sept 7", title: "Studio closed: Labor Day", type: "closed", note: "" },
  { month: "September", when: "Mon \u00b7 Sept 14", title: "Classes begin!", type: "milestone", note: "The 2026/27 season is underway." },
  { month: "October", when: "Mon \u00b7 Oct 26", title: "Recital costume deposits due", type: "due", note: "$85 per class \u00b7 Trio $180 \u00b7 Combo $90" },
  { month: "October", when: "Sat \u00b7 Oct 31", title: "Studio closed: Halloween", type: "closed", note: "" },
  { month: "November", when: "Nov 24\u201329", title: "Studio closed: Thanksgiving break", type: "closed", note: "" },
  { month: "December", when: "Dec 21 \u2013 Jan 3", title: "Studio closed: Holiday break", type: "closed", note: "" },
  { month: "January", when: "Mon \u00b7 Jan 4", title: "Classes resume", type: "milestone", note: "" },
  { month: "January", when: "Mon \u00b7 Jan 18", title: "Studio closed: MLK observance", type: "closed", note: "" },
  { month: "February", when: "Feb 13\u201319", title: "Studio closed: Mid-winter break", type: "closed", note: "" },
  { month: "March / April", when: "Mar 26 \u2013 Apr 4", title: "Studio closed: Spring break", type: "closed", note: "" },
  { month: "May", when: "Sat \u00b7 May 1", title: "Recital tickets on sale", type: "tickets", note: "" },
  { month: "May", when: "Mid-May", title: "Picture days at Barbara’s Academy", type: "event", note: "Photographer: Barbara’s Academy alumna Mati Ficara" },
  { month: "May", when: "May 28\u201331", title: "Studio closed: Memorial weekend", type: "closed", note: "" },
  { month: "June", when: "Date TBA", title: "Dress rehearsal", type: "performance", note: "The week of the recital \u00b7 details sent to families in spring" },
  { month: "June", when: "Sat \u00b7 June 5", title: "Year-end recital", type: "performance", note: "The night every dancer works toward" }
];
