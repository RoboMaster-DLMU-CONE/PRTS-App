function Terminal() {
    return (
        <div className="collapse">
            <input type="checkbox"/>
            <h2 className="card-title collapse-title">虚拟终端</h2>
            <p className="collapse-content">$~:prts ls unit</p>
        </div>
    );
}

export default Terminal;