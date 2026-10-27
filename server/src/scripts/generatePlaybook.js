const fs = require('fs');
const path = require('path');

const rules = [];

// Helper to push rules
function addRule(id, category, riskTier, title, ruleText, example) {
  rules.push({ id, category, riskTier, title, ruleText, example });
}

// ==========================================
// HIGH RISK RULES (H-01 to H-45) - 45 rules
// ==========================================
addRule("H-01", "INDEMNIFICATION", "HIGH", 
  "Uncapped Indemnification Liability", 
  "Uncapped indemnification obligations, indemnification extending to consequential, indirect, or punitive damages, or absence of mutual liability limitations.",
  "Supplier shall indemnify and hold Customer harmless against any and all claims, damages, liabilities, and losses whatsoever without monetary limitation.");

addRule("H-02", "INDEMNIFICATION", "HIGH",
  "Sole Negligence & Gross Negligence Indemnity",
  "Indemnification clauses requiring a party to indemnify the other against the indemnified party's own negligence, willful misconduct, or strict liability.",
  "Customer agrees to indemnify Provider against all liabilities arising from the performance of Services, including Provider's own ordinary or gross negligence.");

addRule("H-03", "INDEMNIFICATION", "HIGH",
  "Non-Reciprocal Third-Party IP Defense",
  "Indemnification obligations or warranty disclaimers lacking reciprocal IP infringement defense, or placing unilateral defense costs on recipient.",
  "Vendor disclaims all warranties of non-infringement and Customer shall defend and indemnify Vendor for any claims arising out of Customer data.");

addRule("H-04", "INDEMNIFICATION", "HIGH",
  "Broad Environmental or Regulatory Indemnification",
  "Uncapped or strict indemnification covering past environmental compliance, regulatory fines, or government investigations beyond fault.",
  "Contractor indemnifies Company for any environmental sanctions or governmental penalties regardless of causation or timing.");

addRule("H-05", "INDEMNIFICATION", "HIGH",
  "Indemnification for Indirect/Consequential Damages",
  "Indemnification scope explicitly covering lost profits, diminution of goodwill, or punitive damages.",
  "Party A shall indemnify Party B for any loss of business, prospective profits, or indirect damages resulting from breach.");

addRule("H-06", "LIABILITY", "HIGH",
  "Complete Waiver of Limitation of Liability",
  "Complete absence or express exclusion of an aggregate liability cap for general contract breach or performance failures.",
  "Neither party's aggregate liability under this Agreement shall be subject to any monetary cap or threshold.");

addRule("H-07", "LIABILITY", "HIGH",
  "One-Way Unlimited Liability",
  "Asymmetric aggregate cap where one party's liability is capped at a minor amount while the other party faces unlimited liability.",
  "Customer's liability is limited to fees paid in previous 1 month, whereas Provider's liability shall be uncapped.");

addRule("H-08", "LIABILITY", "HIGH",
  "Uncapped Liquidated Damages",
  "Liquidated damages provisions without aggregate caps or daily limits, functioning effectively as punitive penalties.",
  "Contractor pays $10,000 per day of delay without cap until project delivery is accepted by Client.");

addRule("H-09", "LIABILITY", "HIGH",
  "Exclusion of Consequential Damages Carve-Out Violation",
  "Unilateral carve-outs allowing one party to claim indirect or lost profits while prohibiting the counterparty.",
  "Client shall not be liable for indirect damages, but Vendor remains liable for Client's lost profits and reputation damage.");

addRule("H-10", "LIABILITY", "HIGH",
  "Disproportionate Liability Cap Multiplier",
  "Liability cap set at an exorbitant multiple (e.g., 10x to 50x annual contract value) detached from commercial fee realities.",
  "Provider's total liability shall not exceed 25 times the total fees paid under this Agreement.");

addRule("H-11", "TERMINATION", "HIGH",
  "Immediate Unilateral Termination Without Cause",
  "Right of one party to terminate immediately without cause, notice period, or obligation to pay accrued fees or work-in-progress.",
  "Company may terminate this agreement at any time with immediate effect upon oral notification without compensation.");

addRule("H-12", "TERMINATION", "HIGH",
  "Immediate Termination on Mere Allegation",
  "Termination for material breach without a mandatory cure period (e.g., 0 days cure) based on mere unsubstantiated claims.",
  "Customer may terminate for default immediately without giving Vendor opportunity to cure any alleged deficiency.");

addRule("H-13", "TERMINATION", "HIGH",
  "Perpetual Lock-In and Non-Cancellable Long-Term Commitment",
  "Multi-year agreements with no early termination right, onerous acceleration of remaining term fees upon any termination.",
  "In the event of termination by Client for any reason, all fees through the 5-year term immediately become due and payable.");

addRule("H-14", "TERMINATION", "HIGH",
  "Post-Termination Forfeiture of Pre-Paid Balances",
  "Clauses declaring that upon termination without cause by vendor, client forfeits all unearned pre-paid subscriptions.",
  "All fees paid in advance are non-refundable under all circumstances, even upon Vendor's termination for convenience.");

addRule("H-15", "CONFIDENTIALITY", "HIGH",
  "Perpetual Confidentiality for Operational Boilerplate",
  "Perpetual confidentiality obligations on standard business or technical information lacking trade secret qualifications.",
  "Recipient shall maintain all disclosed information confidential in perpetuity without time limitation.");

addRule("H-16", "CONFIDENTIALITY", "HIGH",
  "No Exclusion for Legally Compelled Disclosure",
  "Confidentiality clauses omitting standard exclusions for disclosures required by court order, subpoena, or securities regulators.",
  "Recipient may not disclose Confidential Information under any circumstances, even if mandated by judicial decree.");

addRule("H-17", "CONFIDENTIALITY", "HIGH",
  "Strict Strict-Liability Trade Secret Warranties",
  "Imposing strict liability or criminal standard compliance on data breach without requiring proof of fault or reasonable security measures.",
  "Any unauthorized disclosure of Confidential Information shall constitute an irremediable breach subject to liquidated damages of $1M.");

addRule("H-18", "IP", "HIGH",
  "Forfeiture of Pre-Existing Background IP",
  "Assigning all right, title, and interest in pre-existing background IP or generic tools/frameworks to the counterparty.",
  "All intellectual property developed, utilized, or incorporated by Consultant shall become the sole property of Client.");

addRule("H-19", "IP", "HIGH",
  "Broad Work Made For Hire on Vendor Software Core",
  "Work made for hire provisions granting customer exclusive ownership over vendor's foundational algorithms and reusable code.",
  "All deliverables and underlying software engines are works made for hire and Client owns all copyright and patents.");

addRule("H-20", "IP", "HIGH",
  "Perpetual Exclusive License Without Royalty",
  "Granting an irrevocable, perpetual, exclusive worldwide license with no ongoing royalty, minimum purchase, or right of revocation.",
  "Licensor grants Licensee an exclusive, perpetual, irrevocable, fully paid-up license to commercialize Licensor's technology.");

addRule("H-21", "IP", "HIGH",
  "No IP Non-Infringement Warranty by Provider",
  "Software or IP licensing agreements where the licensor completely disclaims ownership and freedom-to-operate warranties.",
  "Software is provided AS IS with zero warranty against third party patent, trademark or copyright infringement.");

addRule("H-22", "OTHER", "HIGH",
  "Waiver of Jury Trial and Class Action Prohibition",
  "One-sided waivers stripping parties of statutory defense rights, class representation, or injunctive relief.",
  "Party B unconditionally waives any right to jury trial or injunctive defense in any court of competent jurisdiction.");

addRule("H-23", "OTHER", "HIGH",
  "Foreign Jurisdiction and Non-Neutral Governing Law",
  "Mandatory dispute resolution in a foreign, high-risk jurisdiction with no connection to the contracting parties.",
  "This agreement shall be governed solely by the laws of offshore Cayman Islands and litigated exclusively in Grand Cayman.");

addRule("H-24", "OTHER", "HIGH",
  "Unilateral Right to Amend Contract Terms",
  "Permitting one party to unilaterally modify contract terms, pricing, or service scope upon web posting without counterparty consent.",
  "Service Provider reserves the right to modify these terms, prices, and SLAs at any time without prior written notice.");

addRule("H-25", "OTHER", "HIGH",
  "Blanket Unrestricted Audit Rights",
  "Allowing full physical and digital inspection of all facilities, source code, and employee records with zero notice.",
  "Buyer may inspect and audit Supplier's entire corporate facilities, books, and code repositories at any hour without notice.");

addRule("H-26", "INDEMNIFICATION", "HIGH",
  "Indemnification for Data Breaches Beyond Causation",
  "Demanding full indemnity for corporate-wide security breaches regardless of whether supplier followed industry security standards.",
  "Vendor indemnifies Client for all data breach liabilities regardless of whether the breach occurred in Vendor's environment.");

addRule("H-27", "LIABILITY", "HIGH",
  "Unlimited Consequential Liability for Software Bugs",
  "Failure to disclaim lost business profits for standard software outages or bugs.",
  "Developer shall be liable for all lost business revenues resulting from downtime or defective code releases.");

addRule("H-28", "TERMINATION", "HIGH",
  "Post-Termination Non-Compete and Market Restrictions",
  "Broad non-compete covenants preventing a vendor from servicing other clients in the industry for multiple years.",
  "Provider shall not offer software services to any entity in the financial services sector for 3 years post-termination.");

addRule("H-29", "IP", "HIGH",
  "Compulsory Source Code Escrow Release on Minor Breach",
  "Escrow release triggered by minor operational dispute rather than bankruptcy or cessation of business operations.",
  "Deposit agent shall immediately release all proprietary source code to Client upon written claim of SLA breach.");

addRule("H-30", "OTHER", "HIGH",
  "Full Indemnity for Tax Liabilities of Counterparty",
  "Shifting the counterparty's corporate, income, or payroll tax obligations onto the service provider.",
  "Contractor agrees to indemnify Client against any and all corporate income, payroll, and value added taxes levied on Client.");

addRule("H-31", "INDEMNIFICATION", "HIGH",
  "Open-Ended Defense Cost Undertaking",
  "Obligation to pay counterparty's attorney fees immediately upon receipt of third-party notice before liability adjudication.",
  "Indemnitor shall pay Indemnitee's legal defense invoices within 10 days of presentation regardless of final outcome.");

addRule("H-32", "LIABILITY", "HIGH",
  "No Liability Cap on Data Protection Claims",
  "Excluding data security and privacy claims entirely from the aggregate liability limitation without sub-caps.",
  "The limitation of liability in Section 8 shall not apply to any claims involving data security, privacy, or GDPR.");

addRule("H-33", "TERMINATION", "HIGH",
  "Automatic Renewal with Draconian Opt-Out Window",
  "Auto-renewing for multi-year terms unless notice is delivered in an unreasonably narrow window (e.g. exactly 5 days before renewal).",
  "Agreement renews for 3-year successive terms unless notice is received between day 90 and day 85 prior to expiration.");

addRule("H-34", "CONFIDENTIALITY", "HIGH",
  "Liquidated Damages for Inadvertent Confidentiality Spill",
  "Pre-stipulated steep penalties for any non-intentional confidentiality breach without showing demonstrable harm.",
  "Any inadvertent breach of Section 6 incurs immediate liquidated damages of $250,000 per occurrence.");

addRule("H-35", "IP", "HIGH",
  "Assignment of Customer Feedback into Exclusive Rights",
  "Clauses where customer suggestions grant vendor total ownership over customer proprietary product roadmap.",
  "Customer assigns all patent and commercial rights in any ideas, feedback, or joint workshop suggestions to Vendor.");

addRule("H-36", "OTHER", "HIGH",
  "Cross-Default with Unrelated Contracts",
  "Breach of any separate agreement between affiliates triggers immediate default and acceleration under this agreement.",
  "A default under any contract between Supplier affiliates and Customer affiliates shall constitute an immediate event of default.");

addRule("H-37", "INDEMNIFICATION", "HIGH",
  "Indemnification Extending to Patent Claims Without Injunction Defense",
  "Indemnitor forced to defend worldwide patent infringement claims without having sole control of defense strategy.",
  "Indemnitor shall defend patent claims but Indemnitee reserves right to settle without Indemnitor's approval.");

addRule("H-38", "LIABILITY", "HIGH",
  "Unlimited Warranty Liability for Third-Party Components",
  "Holding service provider strictly liable for open source or third-party cloud infrastructure failures.",
  "Supplier guarantees 100% uptime of third-party cloud infrastructure and assumes unlimited liability for outages.");

addRule("H-39", "TERMINATION", "HIGH",
  "Termination upon Change of Control Triggering Penalty",
  "Triggering steep penalty fees if a company undergoes merger, recapitalization, or acquisition.",
  "If Vendor undergoes change of control, Client may terminate and Vendor shall pay 12 months fees as liquidation fee.");

addRule("H-40", "CONFIDENTIALITY", "HIGH",
  "Strict Criminal Background Disclosures of Personnel",
  "Requiring disclosure of employee personal medical, biometric, or private records violating local privacy statutes.",
  "Contractor must disclose full biometric and medical screening records of all staff assigned to account.");

addRule("H-41", "IP", "HIGH",
  "Mandatory Patent Cross-License Grant-Back",
  "Requiring licensee to grant back royalty-free worldwide patent rights for any improvement made during term.",
  "Licensee grants Licensor a perpetual, royalty-free, exclusive license to any improvements invented by Licensee.");

addRule("H-42", "OTHER", "HIGH",
  "Exclusive Dealing and Restraint of Trade",
  "Prohibiting a party from engaging in ordinary commercial transactions with competitors across all lines of business.",
  "Supplier shall not provide any IT consulting services to any other enterprise in North America.");

addRule("H-43", "LIABILITY", "HIGH",
  "Waiving All Defenses to Consequential Damages",
  "Explicit clause declaring that all lost revenues and customer goodwill shall be deemed direct damages.",
  "The parties agree that lost revenue, goodwill, and business opportunity shall be treated as direct damages hereunder.");

addRule("H-44", "INDEMNIFICATION", "HIGH",
  "Uncapped Environmental Contamination Indemnity",
  "Requiring indemnification for pre-existing environmental hazards unknown at contract execution.",
  "Lessee agrees to indemnify Lessor for all environmental contamination discovered on premises regardless of date of origin.");

addRule("H-45", "OTHER", "HIGH",
  "Unilateral Sanctions Acceleration",
  "Permitting immediate contract forfeiture and asset freezing based on unilateral determination of compliance concern.",
  "Client may unilaterally freeze all payments and seize equipment upon its sole suspicion of regulatory concern.");

// ==========================================
// MEDIUM RISK RULES (M-01 to M-50) - 50 rules
// ==========================================
addRule("M-01", "INDEMNIFICATION", "MEDIUM",
  "Asymmetric Indemnification Obligations",
  "One party provides comprehensive indemnity while the other party provides no reciprocal indemnity for IP or breach.",
  "Provider indemnifies Customer against breach, but Customer provides no indemnification for misuse of deliverables.");

addRule("M-02", "INDEMNIFICATION", "MEDIUM",
  "Short Notice Requirement for Indemnity Defense",
  "Strict requirement to tender defense within unrealistically short period (e.g., 48 hours) or forfeit indemnification.",
  "Indemnitee must give written notice within 2 business days of claim notice or waive all indemnification rights.");

addRule("M-03", "INDEMNIFICATION", "MEDIUM",
  "Indemnification for Indirect Regulatory Penalties",
  "Indemnification covering administrative agency inquiries without a finding of fault.",
  "Contractor shall reimburse Customer for expenses incurred responding to regulatory inquiries regarding Contractor's work.");

addRule("M-04", "LIABILITY", "MEDIUM",
  "Asymmetric Liability Cap Multipliers",
  "Liability cap set at 2x to 3x annual fees, or differing liability caps between Customer and Supplier.",
  "Provider's liability is capped at 3x annual contract value, whereas Customer's liability is capped at 1x contract value.");

addRule("M-05", "LIABILITY", "MEDIUM",
  "High Multiple Super-Caps for Data Security",
  "Data protection liability super-cap set at 5x annual fees rather than standard insurance-backed coverage.",
  "Liability for data privacy breaches shall be subject to a special super-cap equal to 5 times annual contract value.");

addRule("M-06", "LIABILITY", "MEDIUM",
  "Liquidated Damages as Sole Remedy Without Disclaimers",
  "Liquidated damages provisions that lack clarity on whether they constitute sole and exclusive remedy.",
  "Delay penalties shall accrue at $1,000/day; Client reserves right to pursue further breach damages concurrently.");

addRule("M-07", "TERMINATION", "MEDIUM",
  "Short Cure Period for Material Breach",
  "Cure period for material breach set under 15 days (e.g., 5 to 10 days) for complex technical or operational covenants.",
  "Either party may terminate for material breach if the breach is not remedied within 7 calendar days of notice.");

addRule("M-08", "OTHER", "MEDIUM",
  "Unilateral Attorney Fee Shifting in Litigation",
  "Unilateral attorney fee shifting in litigation or unilateral audit rights lacking at least 15 business days' prior written notice.",
  "If Customer prevails in any action under this Agreement, Vendor shall pay Customer's full attorney fees.");

addRule("M-09", "TERMINATION", "MEDIUM",
  "Termination for Convenience with Inadequate Notice",
  "Termination for convenience permitted on 15 to 29 days' notice without structured off-boarding or transition assistance.",
  "Customer may terminate for convenience upon 20 days' written notice to Provider.");

addRule("M-10", "TERMINATION", "MEDIUM",
  "Termination Triggered by Insolvency or Material Adverse Change",
  "Allowing termination on subjective material adverse financial change before formal bankruptcy proceedings.",
  "Either party may terminate if in its reasonable judgment the other party's creditworthiness has materially deteriorated.");

addRule("M-11", "CONFIDENTIALITY", "MEDIUM",
  "Overly Broad Definition of Confidential Information",
  "Defining all communications, whether marked or unmarked, as confidential without standard marking requirements.",
  "Confidential Information shall include all oral statements and written materials exchanged between the parties.");

addRule("M-12", "CONFIDENTIALITY", "MEDIUM",
  "Extended Confidentiality Duration Beyond Standard Term",
  "Confidentiality duration of 5 to 10 years for ordinary commercial data.",
  "The obligations of non-disclosure shall survive termination of this Agreement for a period of 7 years.");

addRule("M-13", "CONFIDENTIALITY", "MEDIUM",
  "Mandatory Return or Destruction Without Archival Exception",
  "Obligation to destroy all confidential data without carve-outs for automated backup tapes and statutory record retention.",
  "Within 5 days of termination, Recipient must purge all Confidential Information from every server and certify destruction.");

addRule("M-14", "IP", "MEDIUM",
  "Ambiguous Work Product Assignment Scope",
  "Vague language regarding whether newly created custom configurations or integrations transfer to client.",
  "All developments and work product generated in connection with the project shall belong to Client.");

addRule("M-15", "IP", "MEDIUM",
  "Non-Exclusive License with Narrow Sublicensing Rights",
  "Granting client right to sublicense vendor technology to arbitrary third parties without vendor prior approval.",
  "Customer receives a perpetual, non-exclusive license with full right to sublicense to affiliated commercial entities.");

addRule("M-16", "IP", "MEDIUM",
  "Restrictive Trademark and Publicity Covenants",
  "Prohibiting vendor from listing client's name or logo in customer lists without unreasonable approval hurdles.",
  "Neither party shall disclose the existence of this relationship or use counterparty logo without executive sign-off.");

addRule("M-17", "OTHER", "MEDIUM",
  "Unfavorable Dispute Resolution Forum",
  "Mandating litigation in a remote domestic state rather than neutral jurisdiction or mutual home courts.",
  "Any legal action shall be brought exclusively in the state or federal courts located in Wilmington, Delaware.");

addRule("M-18", "OTHER", "MEDIUM",
  "Mandatory Binding Arbitration with High Fee Sharing",
  "Imposing AAA or ICC arbitration with no streamlined procedure for claims under $100,000.",
  "All disputes shall be resolved by three arbitrators under ICC rules in New York City with costs shared equally.");

addRule("M-19", "OTHER", "MEDIUM",
  "Non-Solicitation Restrictions of Personnel",
  "Broad non-solicitation covenants covering general job advertisements or unassigned employees.",
  "Neither party shall hire or solicit any employee of the other party during the term and for 12 months thereafter.");

addRule("M-20", "OTHER", "MEDIUM",
  "Annual Price Escalation Index Linked to Uncapped Inflation",
  "Permitting automatic annual fee increases tied to inflation indices without a ceiling percentage cap.",
  "Subscription fees shall increase annually on the anniversary date by the percentage increase in CPI plus 3%.");

addRule("M-21", "OTHER", "MEDIUM",
  "Audit Frequency Exceeding Once Per Calendar Year",
  "Audit clauses allowing multiple inspections per year or audits by direct market competitors.",
  "Buyer may conduct up to three audits per calendar year of Seller's operational processes.");

addRule("M-22", "INDEMNIFICATION", "MEDIUM",
  "Conditioned Indemnity on Strict Defense Cooperation",
  "Allowing indemnitor to disclaim liability if indemnified party fails to provide minor administrative assistance.",
  "Failure to provide requested case files within 5 days releases Indemnitor from all defense obligations.");

addRule("M-23", "LIABILITY", "MEDIUM",
  "Exclusion of Gross Negligence from Liability Cap",
  "Standard exclusion of gross negligence where gross negligence is loosely defined under foreign law standards.",
  "The limitation of liability shall not apply to damages caused by gross negligence or reckless conduct.");

addRule("M-24", "TERMINATION", "MEDIUM",
  "Transition Services Without Rate Agreement",
  "Requiring provider to offer post-termination transition services for up to 6 months at unspecified legacy rates.",
  "Vendor must provide transition assistance for up to 180 days upon termination at current contractual rates.");

addRule("M-25", "CONFIDENTIALITY", "MEDIUM",
  "Residual Knowledge Exception Ambiguity",
  "Residual knowledge clause allowing counterparty employees to use retained mental impressions without safeguard.",
  "Either party may use information retained in unaided human memory for any commercial purpose.");

addRule("M-26", "IP", "MEDIUM",
  "Invention Assignment of Off-Hours Developments",
  "Invention assignment clauses claiming developments created by contractor without client tools or client time.",
  "Contractor assigns all inventions conceived during the term of engagement relating to Client's general industry.");

addRule("M-27", "OTHER", "MEDIUM",
  "Payment Terms Exceeding 60 Days",
  "Net payment terms extending past 60 or 90 days without interest on overdue balances.",
  "Invoices shall be payable Net 75 days from date of receipt by Customer accounting department.");

addRule("M-28", "OTHER", "MEDIUM",
  "Right of Set-Off Against Future Invoices",
  "Allowing customer to withhold payments on current invoices due to disputed claims under separate statements of work.",
  "Customer may set off any amounts owed by Vendor against any invoice payable under this Agreement.");

addRule("M-29", "OTHER", "MEDIUM",
  "Strict Compliance with Customer Internal Policies Without Copy",
  "Requiring vendor adherence to customer internal policies without attaching or providing copies of policies.",
  "Vendor shall adhere to all Customer codes of conduct and security standards as amended from time to time.");

addRule("M-30", "LIABILITY", "MEDIUM",
  "Service Level Credits as Non-Exclusive Remedy",
  "Service level credits do not explicitly constitute the exclusive financial remedy for SLA downtime.",
  "SLA uptime credits shall be issued monthly; Customer retains all common law damages remedies for downtime.");

addRule("M-31", "INDEMNIFICATION", "MEDIUM",
  "Indemnification for Pre-Existing Intellectual Property Inaccuracies",
  "Indemnity covering third party components without clear territorial bounds (worldwide vs specific countries).",
  "Supplier indemnifies Customer against IP infringement claims brought in any jurisdiction worldwide.");

addRule("M-32", "TERMINATION", "MEDIUM",
  "Unilateral Extension of Contract Term",
  "Allowing one party to unilaterally extend contract term by option notice without renegotiation.",
  "Customer reserves the unilateral option to extend this agreement for two additional one-year periods.");

addRule("M-33", "CONFIDENTIALITY", "MEDIUM",
  "Personal Identifiable Information Handling Without DPA",
  "Contract transfers PII or personal data without an executed formal Data Processing Addendum (DPA).",
  "Vendor shall process customer employee user data as necessary to perform the services hereunder.");

addRule("M-34", "IP", "MEDIUM",
  "Patent Defense Restrictions on Settlement",
  "Preventing indemnitor from settling a claim by substituting equivalent non-infringing software.",
  "Settlement of any IP claim requires prior written approval of Customer, even if involving no financial admission.");

addRule("M-35", "OTHER", "MEDIUM",
  "Unilateral Right to Change Service Specifications",
  "Client right to order changes in deliverable scope without formal bilateral Change Order procedure.",
  "Client may adjust deliverable milestones and scope by providing written specifications to Project Lead.");

addRule("M-36", "OTHER", "MEDIUM",
  "Warranty Period Exceeding 12 Months",
  "Custom software warranty period extending for 2 to 3 years post-acceptance.",
  "Developer warrants software against material defects for a period of 24 months following final acceptance.");

addRule("M-37", "LIABILITY", "MEDIUM",
  "Aggregate Cap Calculated on Trailing 3 Months Only",
  "Limiting customer recovery to an excessively small fraction of the contract value (e.g. trailing 3 months fees).",
  "Vendor's maximum liability is limited to fees paid during the three (3) months preceding the incident.");

addRule("M-38", "INDEMNIFICATION", "MEDIUM",
  "Indemnification Arising from Customer Modifications",
  "Indemnity that does not clearly carve out claims resulting from modifications made by the customer.",
  "Provider indemnifies against patent infringement, unless modified by Customer in an unauthorized manner.");

addRule("M-39", "TERMINATION", "MEDIUM",
  "Immediate Termination for Reputational Harm",
  "Subjective termination right if one party's brand is perceived to be negatively impacted by counterparty news.",
  "Either party may terminate if the other party is subject to negative publicity or public scandal.");

addRule("M-40", "CONFIDENTIALITY", "MEDIUM",
  "Mandatory Notification of Security Inquiries Within 12 Hours",
  "Unrealistically tight incident notification window for minor inquiries not involving actual data breach.",
  "Vendor must notify Customer within 12 hours of receiving any inquiry from information security regulators.");

addRule("M-41", "IP", "MEDIUM",
  "Joint IP Ownership Without Defined Exploitation Rights",
  "Declaring joint ownership of newly developed IP without establishing royalty and licensing rights between co-owners.",
  "Any intellectual property developed jointly shall be owned jointly by the parties.");

addRule("M-42", "OTHER", "MEDIUM",
  "Severability Clause Without Reform Covenant",
  "Severability provision where invalid terms are stricken without requiring court to reform terms to mirror intent.",
  "If any provision is held unenforceable, such provision shall be severed and remainder shall remain in effect.");

addRule("M-43", "OTHER", "MEDIUM",
  "Time is of the Essence Clause on Ancillary Obligations",
  "Declaring time is of the essence for administrative reporting rather than core product delivery dates.",
  "Time is of the essence with respect to all quarterly performance report delivery dates.");

addRule("M-44", "LIABILITY", "MEDIUM",
  "No Exclusion of Force Majeure for Critical Obligations",
  "Force majeure clause omitting standard excused performance for natural disasters or cloud provider blackouts.",
  "Failure of telecommunications or electric utilities shall not excuse performance under Section 4.");

addRule("M-45", "TERMINATION", "MEDIUM",
  "Termination upon Failure of Minority Milestone",
  "Permitting total contract termination for a 2-day delay on a non-critical interim design draft.",
  "Client may terminate the entire Agreement for default if Interim Milestone 2 is delayed by more than 48 hours.");

addRule("M-46", "CONFIDENTIALITY", "MEDIUM",
  "Recipient Bears Full Burden of Proof on Exceptions",
  "Shifting entire evidentiary burden onto recipient to establish that public information was lawfully obtained.",
  "Recipient must produce written contemporaneous records to establish applicability of confidentiality exceptions.");

addRule("M-47", "IP", "MEDIUM",
  "Customer Retains Broad Derivative Work Rights on Deliverables",
  "Granting customer rights to create derivative works that may compete with vendor core product lines.",
  "Customer may modify, decompile, and create derivative works of deliverables for internal operations.");

addRule("M-48", "OTHER", "MEDIUM",
  "Mandatory Insurance Minimums Beyond Standard Commercial Practice",
  "Requiring cyber or errors & omissions insurance policy limits disproportionate to contract size (e.g. $10M for a $50k deal).",
  "Vendor must maintain $10,000,000 in Cyber Errors and Omissions insurance throughout the term.");

addRule("M-49", "INDEMNIFICATION", "MEDIUM",
  "Indemnification for Third Party Open Source License Compliance",
  "Requiring supplier to indemnify customer for any non-compliance with copyleft licenses in third party libraries.",
  "Supplier indemnifies Customer against all claims alleging GPL or copyleft license violations in third party libraries.");

addRule("M-50", "OTHER", "MEDIUM",
  "Non-Assignment Without Consent Even to Affiliates",
  "Prohibiting corporate restructuring, merger, or affiliate assignment without counterparty's prior written consent.",
  "Neither party may assign this agreement, including to an affiliate or successor in interest, without consent.");

// ==========================================
// LOW RISK RULES (L-01 to L-47) - 47 rules
// ==========================================
addRule("L-01", "INDEMNIFICATION", "LOW",
  "Standard Mutual IP Indemnification",
  "Mutual indemnification for third-party copyright, patent, and trade secret claims, conditioned on prompt notice and defense control.",
  "Each party shall defend and indemnify the other against third-party claims alleging that its respective technology infringes IP rights.");

addRule("L-02", "INDEMNIFICATION", "LOW",
  "Express Defense Control and Settlement Approval",
  "Indemnitor has sole control of defense with proviso that settlements requiring financial contribution need indemnitee consent.",
  "Indemnitor shall control defense; neither party shall settle any claim admitting liability without the other's prior written consent.");

addRule("L-03", "INDEMNIFICATION", "LOW",
  "Prompt Notice Requirement for Indemnity",
  "Prompt written notice required within 30 days of receiving claim, with forfeiture only if failure prejudices defense.",
  "Indemnitee shall provide prompt written notice of claims; failure to give prompt notice releases liability only to extent prejudiced.");

addRule("L-04", "LIABILITY", "LOW",
  "Standard 1x Annual Contract Value Liability Cap",
  "Mutual aggregate liability cap equal to total fees paid or payable in the 12 months preceding the incident.",
  "Each party's total aggregate liability under this Agreement shall not exceed the total fees paid in the preceding twelve (12) months.");

addRule("L-05", "LIABILITY", "LOW",
  "Mutual Exclusion of Consequential and Indirect Damages",
  "Bilateral disclaimer of indirect, special, incidental, punitive, or consequential damages.",
  "Neither party shall be liable for any indirect, special, incidental, or consequential damages, including loss of profits.");

addRule("L-06", "LIABILITY", "LOW",
  "Reasonable Liquidated Damages as Exclusive Remedy",
  "Clearly stipulated reasonable delay credits capped at 10% of statement of work as sole financial remedy.",
  "SLA uptime credits shall be Customer's sole and exclusive financial remedy for unavailability of the hosted service.");

addRule("L-07", "TERMINATION", "LOW",
  "Standard 30-Day Cure Period for Material Breach",
  "Either party may terminate for material breach upon 30 days' advance written notice with opportunity to cure.",
  "Either party may terminate upon written notice if the other party fails to cure a material breach within thirty (30) days.");

addRule("L-08", "TERMINATION", "LOW",
  "Mutual Termination for Convenience with 30+ Days Notice",
  "Mutual right to terminate for convenience upon at least 30 to 60 days' written notice with pro-rata refund of unearned fees.",
  "Mutual termination for convenience permitted upon at least 30 days' advance written notice with pro-rata refund of unearned fees.");

addRule("L-09", "TERMINATION", "LOW",
  "Termination upon Formal Involuntary Bankruptcy",
  "Termination permitted if the other party files bankruptcy, enters liquidation, or ceases commercial operations.",
  "Either party may terminate if the other party dissolves, files for bankruptcy, or has a receiver appointed.");

addRule("L-10", "CONFIDENTIALITY", "LOW",
  "Standard 3-Year Confidentiality Term with Trade Secret Carve-Out",
  "Confidentiality duration of 3 to 5 years, preserving indefinite protection solely for legitimate trade secrets.",
  "Confidentiality obligations shall continue for three (3) years post-termination, except trade secrets shall remain protected indefinitely.");

addRule("L-11", "CONFIDENTIALITY", "LOW",
  "Standard Commercial Confidentiality Exclusions",
  "Express exclusions for public information, already known data, independently developed materials, and court-compelled disclosures.",
  "Confidential Information does not include data already public, known prior to disclosure, independently developed, or court-mandated.");

addRule("L-12", "CONFIDENTIALITY", "LOW",
  "Standard Legal Process Notice and Protective Order",
  "Obligation to give prompt notice of subpoena or court order so disclosing party can seek a protective order.",
  "If legally compelled to disclose, recipient shall provide prompt notice to enable disclosing party to seek protective orders.");

addRule("L-13", "IP", "LOW",
  "Reservation of Pre-Existing Background Intellectual Property",
  "Each party retains all right, title, and interest in its pre-existing background IP and foundational tools.",
  "Each party retains exclusive ownership of its pre-existing intellectual property, proprietary tools, and standard software.");

addRule("L-14", "IP", "LOW",
  "Non-Exclusive Customer License to Deliverables",
  "Customer receives a perpetual, non-exclusive, internal business-use license for completed custom deliverables.",
  "Vendor grants Customer a perpetual, non-exclusive, worldwide license to use the deliverables for its internal business operations.");

addRule("L-15", "IP", "LOW",
  "Express Feedback License Without Mandatory Assignment",
  "Feedback granted as non-exclusive, royalty-free license without forcing customer to assign future product rights.",
  "Customer grants Vendor a non-exclusive, royalty-free license to use feedback for product improvements.");

addRule("L-16", "OTHER", "LOW",
  "Neutral Governing Law and Venue",
  "Standard neutral corporate jurisdiction (e.g., New York, Delaware, or California) with reciprocal court access.",
  "This Agreement shall be governed by the laws of the State of Delaware, without regard to conflict of law principles.");

addRule("L-17", "OTHER", "LOW",
  "Standard Bilateral Dispute Escalation and Mediation",
  "Executive negotiation followed by commercial mediation before initiating formal court proceedings.",
  "Disputes shall first be referred to executive officers for 30 days, followed by non-binding mediation prior to litigation.");

addRule("L-18", "OTHER", "LOW",
  "Permitted Assignment to Affiliates or Merger Successors",
  "Either party may assign agreement without consent in connection with a merger, reorganization, or sale of substantially all assets.",
  "Either party may assign this Agreement to an affiliate or successor in interest in connection with a merger or acquisition.");

addRule("L-19", "OTHER", "LOW",
  "Standard Force Majeure with Written Notice",
  "Excusing performance during unforeseeable natural catastrophes, wars, or governmental shutdowns with duty to mitigate.",
  "Neither party shall be liable for delay resulting from acts of God, strikes, pandemics, or government orders.");

addRule("L-20", "OTHER", "LOW",
  "Standard Net 30 Day Payment Terms",
  "Standard commercial payment terms of Net 30 days from date of valid invoice receipt.",
  "Customer shall pay undisputed invoices within thirty (30) days from receipt.");

addRule("L-21", "OTHER", "LOW",
  "Standard Severability and Reformation",
  "Court may reform unenforceable provisions to effect original intent, preserving valid clauses.",
  "If any provision is held invalid, the remainder shall continue in effect and the invalid clause reformed to reflect parties' intent.");

addRule("L-22", "OTHER", "LOW",
  "Entire Agreement and Written Amendments",
  "Standard integration clause requiring written amendments signed by authorized representatives.",
  "This Agreement constitutes the entire understanding and may only be amended in writing signed by authorized representatives.");

addRule("L-23", "OTHER", "LOW",
  "Standard Notices via Electronic Mail and Certified Post",
  "Notices effective upon confirmed email transmission or recognized commercial courier delivery.",
  "All formal notices must be in writing and delivered via email with confirmed receipt or overnight courier.");

addRule("L-24", "OTHER", "LOW",
  "Independent Contractor Status",
  "Explicit confirmation of independent contractor relationship with no joint venture, agency, or partnership.",
  "The parties are independent contractors; nothing herein shall create an agency, partnership, or employment relationship.");

addRule("L-25", "INDEMNIFICATION", "LOW",
  "Customer Indemnity for Customer-Supplied Data",
  "Customer indemnifies vendor for claims alleging customer-provided data infringes privacy or third-party IP rights.",
  "Customer agrees to defend Vendor against claims alleging that Customer data violates third-party copyright or privacy.");

addRule("L-26", "LIABILITY", "LOW",
  "Mutual Symmetrical Aggregate Liability Cap",
  "Equal liability caps applied evenly to both parties without asymmetric advantage.",
  "Each party's aggregate liability shall be limited to amounts paid or payable under the applicable Statement of Work.");

addRule("L-27", "TERMINATION", "LOW",
  "Orderly Data Return and Transition on Expiry",
  "Structured protocol for export of customer data in standard format upon termination at no extra charge.",
  "Upon expiration, Vendor shall make Customer data available for download in CSV/JSON format for forty-five (45) days.");

addRule("L-28", "CONFIDENTIALITY", "LOW",
  "Reasonable Security Standard for Confidential Data",
  "Standard duty of care equal to the degree of care used for own confidential data, not less than reasonable care.",
  "Each party shall protect confidential information with the same degree of care it uses for its own confidential data.");

addRule("L-29", "IP", "LOW",
  "Standard Non-Infringement Warranty with Replacement Remedy",
  "Warranty of non-infringement with standard remedy: procure right to use, replace with equivalent, or refund pro-rata.",
  "If software is held to infringe, Licensor shall procure the right to continue use, replace with non-infringing software, or refund.");

addRule("L-30", "OTHER", "LOW",
  "Reasonable Annual Audit with 15 Business Days Notice",
  "Annual audit during normal business hours upon at least 15 business days' notice at auditor's expense.",
  "Audits shall occur during normal business hours upon 15 business days' written notice not more than once per year.");

addRule("L-31", "OTHER", "LOW",
  "Mutual Non-Disparagement During Term",
  "Mutual commitment not to make false or defamatory public statements concerning counterparty.",
  "Neither party shall publish defamatory, derogatory, or disparaging statements regarding the other party.");

addRule("L-32", "LIABILITY", "LOW",
  "Insurance Carve-In to Liability Caps",
  "Explicit provision that insurance policy proceeds shall be credited toward liability settlements.",
  "Amounts recovered from third-party insurance policies shall be credited toward applicable liability limits.");

addRule("L-33", "TERMINATION", "LOW",
  "Survival of Accrued Rights and Payment Obligations",
  "Termination does not waive accrued payment obligations or liability for prior breaches.",
  "Termination shall not affect rights or obligations accrued prior to effective date of termination.");

addRule("L-34", "CONFIDENTIALITY", "LOW",
  "Standard Residual Memory Knowledge Carve-Out",
  "Permitting use of non-specific general ideas retained in unaided human memory without copying documentation.",
  "General skills and techniques retained in unaided memory without deliberate memorization may be used.");

addRule("L-35", "IP", "LOW",
  "Vendor Owns Platform Metrics and De-Identified Telemetry",
  "Vendor retains right to aggregate, anonymize, and analyze telemetry to improve infrastructure security and uptime.",
  "Vendor may aggregate de-identified system telemetry to monitor performance and improve the service.");

addRule("L-36", "OTHER", "LOW",
  "Good Faith Dispute Resolution Period",
  "Mandatory 20-day informal discussion period before issuing formal legal notices of default.",
  "Parties agree to attempt good-faith informal resolution for twenty (20) days prior to issuing breach notice.");

addRule("L-37", "INDEMNIFICATION", "LOW",
  "Indemnification Cap Aligned with Comprehensive Insurance",
  "Liability indemnification backed by standard commercial general liability and errors & omissions insurance.",
  "Indemnity obligations for property damage shall be backed by commercial general liability policy limits.");

addRule("L-38", "LIABILITY", "LOW",
  "Mutual Limitation for Open Source Software",
  "Standard disclaimer of warranties for third-party open source components included under MIT/Apache licenses.",
  "Third-party open-source libraries are governed by their respective licenses without supplemental warranties.");

addRule("L-39", "TERMINATION", "LOW",
  "Pro-Rata Refund of Prepaid Fees upon Breach by Vendor",
  "Customer receives pro-rata refund of prepaid unearned fees if customer terminates for vendor uncured breach.",
  "If Customer terminates for Vendor breach, Vendor shall refund prepaid fees for the remaining unused term.");

addRule("L-40", "CONFIDENTIALITY", "LOW",
  "Safe Harbor for Standard Auditor Disclosures",
  "Confidentiality disclosure permitted to legal counsel, accountants, and insurers bound by professional ethics.",
  "Disclosures are permitted to financial and legal advisors under confidentiality duties comparable to this Agreement.");

addRule("L-41", "IP", "LOW",
  "Customer Retains Full Ownership of Customer Data",
  "Customer retains all right, title, and interest in all data uploaded or processed through the platform.",
  "Customer retains all right, title, and interest in Customer Data, and Vendor acquires no ownership rights therein.");

addRule("L-42", "OTHER", "LOW",
  "Waiver Must Be Explicit and In Writing",
  "Failure to enforce any covenant does not constitute an ongoing or future waiver of that right.",
  "No waiver of any breach shall be effective unless in writing and signed by the party granting the waiver.");

addRule("L-43", "OTHER", "LOW",
  "Counterparts and Electronic Signatures Valid",
  "Contract may be executed in counterparts and via electronic signature tools (DocuSign/AdobeSign).",
  "This Agreement may be executed in counterparts and electronically, each of which shall be deemed an original.");

addRule("L-44", "OTHER", "LOW",
  "Standard Currency and Tax Apportionment",
  "Prices quoted in USD with customer responsible for sales/use taxes and vendor responsible for income taxes.",
  "All fees are payable in USD and exclusive of applicable sales taxes, which shall be invoiced to Customer.");

addRule("L-45", "TERMINATION", "LOW",
  "Termination upon Failure of Key Condition Precedent",
  "Contract permits termination without penalty if mandatory governmental license or regulatory approval is denied.",
  "Either party may terminate without penalty if required regulatory export authorizations are denied.");

addRule("L-46", "LIABILITY", "LOW",
  "Direct Damages Cap with Standard Multiplier",
  "Direct damages cap standard 12-month fees with clear definition of recoverable direct damage types.",
  "Direct damages recoverable by either party shall be capped at the fees paid in the preceding 12 months.");

addRule("L-47", "OTHER", "LOW",
  "Heading Section Captions For Convenience Only",
  "Clause headings and titles are inserted for convenience only and do not affect legal interpretation.",
  "Section headings are for reference purposes only and shall not limit or interpret the text of any provision.");

// Verification of exact counts
console.log(`Total generated rules: ${rules.length}`);
const high = rules.filter(r => r.riskTier === 'HIGH').length;
const med = rules.filter(r => r.riskTier === 'MEDIUM').length;
const low = rules.filter(r => r.riskTier === 'LOW').length;
console.log(`HIGH: ${high}, MEDIUM: ${med}, LOW: ${low}`);

const outputPath = path.join(__dirname, '..', 'data', 'playbookRules.json');
fs.writeFileSync(outputPath, JSON.stringify(rules, null, 2), 'utf-8');
console.log(`Saved rules to ${outputPath}`);
