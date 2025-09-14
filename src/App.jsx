import { Routes, Route } from "react-router-dom";
import HomeComponent from './components/HomeComponent';
import ImageCompress from './routes/ImageCompress'
import PdfCompress from './routes/PdfCompress'
import ImageToPdf from './routes/ImageToPdf'
import ImageJoin from './routes/ImageJoin'

const App = () => {
    return (
        <div>
            <Routes>
                <Route path='/' Component={HomeComponent} />
                <Route path="/imagecompress" Component={ImageCompress} />
                <Route path="/pdfcompress" Component={PdfCompress} />
                <Route path="/imagetopdf" Component={ImageToPdf} />
                <Route path="/imagejoin" Component={ImageJoin} />
            </Routes>
        </div>
    )
}

export default App

