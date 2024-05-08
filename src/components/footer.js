import React from "react";

const Footer = () => {
    return (
        <>
            <footer className="text-lg-start bg-body-tertiary text-muted" style={{ margin: "0px", opacity: "0.7", bottom: "0",width: "100%"}}>
                <section style={{ margin: "0px", padding: "15px", backgroundColor: "#abd8ae"}}>
                    <div>
                        <div>
                            {/* Content */}
                            <h6 className="fw-bold mt-1">
                                <i className="fas fa-gem" />SVOE Monitoring V.1.01
                            </h6>
                        </div>
                        {/* Grid row */}
                    </div>
                </section>

            </footer>
        </>)
}

export default Footer;